import { google } from 'googleapis';

// Enhanced API Key Manager with automatic fallback and data validation
class YouTubeAPIManager {
  private apiKeys: string[] = [];
  private currentKeyIndex = 0;
  private failedKeys = new Set<string>();
  private youtubeClients = new Map<string, any>();
  private keyUsageCount = new Map<string, number>();
  private lastSuccessfulKey: string | null = null;

  constructor() {
    this.loadAPIKeys();
  }

  private loadAPIKeys() {
    // Load all available API keys from environment variables
    const keys: string[] = [];
    let index = 1;

    // Load up to 10 API keys
    while (index <= 10) {
      const key = process.env[`YOUTUBE_API_KEY_${index}`];
      if (!key) break;
      keys.push(key);
      index++;
    }

    // Fallback to single key if no numbered keys found
    if (keys.length === 0) {
      const singleKey = process.env.YOUTUBE_API_KEY;
      if (singleKey) {
        keys.push(singleKey);
      }
    }

    this.apiKeys = keys;
    console.log(`Loaded ${keys.length} YouTube API keys for automatic fallback`);
  }

  private getNextAvailableKey(): string | null {
    if (this.apiKeys.length === 0) return null;

    // Try up to apiKeys.length times to find an available key
    for (let attempts = 0; attempts < this.apiKeys.length; attempts++) {
      const key = this.apiKeys[this.currentKeyIndex];

      if (!this.failedKeys.has(key)) {
        return key;
      }

      // Move to next key
      this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;
    }

    return null; // All keys have failed
  }

  private getYouTubeClient(apiKey: string) {
    if (!this.youtubeClients.has(apiKey)) {
      this.youtubeClients.set(apiKey, google.youtube({
        version: 'v3',
        auth: apiKey,
      }));
    }
    return this.youtubeClients.get(apiKey);
  }

  // Enhanced method that handles both API errors and empty data results
  public async executeWithDataValidation<T>(
    operation: (youtubeClient: any) => Promise<T>,
    validateData: (data: T) => boolean,
    operationName: string = 'YouTube API operation'
  ): Promise<T> {
    let lastError: any = null;
    let attempts = 0;
    const maxAttempts = this.apiKeys.length;

    while (attempts < maxAttempts) {
      const apiKey = this.getNextAvailableKey();

      if (!apiKey) {
        throw new Error(`All YouTube API keys have failed. Last error: ${lastError?.message || 'Unknown error'}`);
      }

      try {
        const youtubeClient = this.getYouTubeClient(apiKey);
        const result = await operation(youtubeClient);

        // Validate that we got actual data (not empty results)
        if (!validateData(result)) {
          console.warn(`${operationName} returned no data with API key ${this.apiKeys.indexOf(apiKey) + 1}, trying next key...`);
          this.failedKeys.add(apiKey); // Mark as failed for this operation
          attempts++;
          this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;
          continue;
        }

        // Success! Track usage and reset failed keys tracking for this key
        this.failedKeys.delete(apiKey);
        this.keyUsageCount.set(apiKey, (this.keyUsageCount.get(apiKey) || 0) + 1);
        this.lastSuccessfulKey = apiKey;

        console.log(`${operationName} succeeded with API key ${this.apiKeys.indexOf(apiKey) + 1} (${this.keyUsageCount.get(apiKey)} uses)`);

        return result;
      } catch (error: any) {
        lastError = error;
        attempts++;

        // Check if this is a quota/rate limit error or other permanent failure
        const errorMessage = error?.message || '';
        const isQuotaError = error.code === 403 ||
                           errorMessage.includes('quota') ||
                           errorMessage.includes('exceeded') ||
                           errorMessage.includes('limit') ||
                           errorMessage.includes('rate limit');

        const isAuthError = error.code === 400 ||
                          errorMessage.includes('invalid') ||
                          errorMessage.includes('suspended') ||
                          errorMessage.includes('disabled') ||
                          errorMessage.includes('unauthorized');

        if (isQuotaError || isAuthError) {
          console.warn(`API key ${this.apiKeys.indexOf(apiKey) + 1} failed permanently (${isQuotaError ? 'quota exceeded' : 'auth error'}), marking as failed: ${errorMessage}`);
          this.failedKeys.add(apiKey);
        } else {
          // For temporary errors, still try next key but don't mark as permanently failed
          console.warn(`${operationName} failed with API key ${this.apiKeys.indexOf(apiKey) + 1}: ${errorMessage}`);
        }

        // Move to next key for next attempt
        this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;
      }
    }

    throw lastError || new Error(`${operationName} failed with all available API keys`);
  }

  // Backward compatible method for operations that don't need data validation
  public async executeWithFallback<T>(
    operation: (youtubeClient: any) => Promise<T>,
    operationName: string = 'YouTube API operation'
  ): Promise<T> {
    return this.executeWithDataValidation(
      operation,
      (data) => true, // Always consider data valid for backward compatibility
      operationName
    );
  }

  public getAvailableKeysCount(): number {
    return Math.max(0, this.apiKeys.length - this.failedKeys.size);
  }

  public getTotalKeysCount(): number {
    return this.apiKeys.length;
  }

  public resetFailedKeys() {
    this.failedKeys.clear();
    console.log('Reset failed API keys tracking');
  }

  // Reset quota-exceeded keys daily (YouTube quota resets daily)
  public resetQuotaExceededKeys() {
    // This method can be called periodically to retry keys that may have quota reset
    console.log('Resetting quota-exceeded API keys for daily quota reset');
    // Note: We keep the failedKeys as-is since we can't distinguish quota vs permanent failures
    // But we can add a timestamp-based reset mechanism if needed
  }

  public getKeyUsageStats(): { [key: string]: number } {
    const stats: { [key: string]: number } = {};
    this.apiKeys.forEach((key, index) => {
      stats[`Key_${index + 1}`] = this.keyUsageCount.get(key) || 0;
    });
    return stats;
  }

  public getLastSuccessfulKeyIndex(): number {
    if (!this.lastSuccessfulKey) return -1;
    return this.apiKeys.indexOf(this.lastSuccessfulKey) + 1;
  }

  // Get quota status information
  public getQuotaStatus(): {
    availableKeys: number;
    totalKeys: number;
    failedKeys: number;
    lastSuccessfulKey: number;
    keyUsageStats: { [key: string]: number };
  } {
    return {
      availableKeys: this.getAvailableKeysCount(),
      totalKeys: this.getTotalKeysCount(),
      failedKeys: this.failedKeys.size,
      lastSuccessfulKey: this.getLastSuccessfulKeyIndex(),
      keyUsageStats: this.getKeyUsageStats()
    };
  }
}

// Export singleton instance
export const youtubeAPIManager = new YouTubeAPIManager();

// Export the current YouTube client for backward compatibility
export const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY || '',
});