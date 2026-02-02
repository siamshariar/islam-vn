import { google } from 'googleapis';
import { youtube_v3 } from 'googleapis';
import { youtubeAPIManager } from './youtube-api-manager';

// YouTube API Quota Management Strategy:
// - Free tier: 10,000 units/day per API key
// - Search requests: 100 units each
// - Channel/Video/Playlist requests: 1 unit each
// - We use multiple keys and aggressive caching to maximize quota usage
// - When quota exceeded, fallback to static data with shorter cache duration

// In-memory cache for API responses
const apiCache = new Map<string, { data: YouTubeVideo[], timestamp: number, isQuotaExceeded?: boolean }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours for successful responses
const QUOTA_EXCEEDED_CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours for quota exceeded responses

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  viewCount: string;
  publishedAt: string;
  channelTitle: string;
}

// Extract channel ID from YouTube URL
function extractChannelId(url: string): string | null {
  // Handle different YouTube URL formats
  const patterns = [
    /youtube\.com\/(@[^\/\?]+)/,           // @handle format - capture with @
    /youtube\.com\/channel\/([^\/\?]+)/,  // /channel/UC... format
    /youtube\.com\/user\/([^\/\?]+)/,     // /user/username format
    /youtube\.com\/c\/([^\/\?]+)/,        // /c/channelname format
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  // If no pattern matches, try to extract from query parameters or other formats
  const urlObj = new URL(url);
  if (urlObj.hostname.includes('youtube.com')) {
    // Check for channel in pathname
    const pathParts = urlObj.pathname.split('/').filter(p => p);
    if (pathParts.length > 0) {
      const firstPart = pathParts[0];
      if (firstPart.startsWith('@') || firstPart.startsWith('UC') || firstPart.length === 24) {
        return firstPart;
      }
    }
  }

  return null;
}

// Convert ISO 8601 duration to readable format
function parseDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '0:00';

  const hours = (match[1] || '').replace('H', '') || '0';
  const minutes = (match[2] || '').replace('M', '') || '0';
  const seconds = (match[3] || '').replace('S', '') || '0';

  const h = parseInt(hours);
  const m = parseInt(minutes);
  const s = parseInt(seconds);

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// Format view count
function formatViewCount(count: string): string {
  const num = parseInt(count);
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

// Fetch videos from a channel with automatic API key rotation
async function fetchChannelVideos(channelUrl: string, maxResults: number = 10): Promise<YouTubeVideo[]> {
  try {
    const channelId = extractChannelId(channelUrl);
    if (!channelId) {
      console.error(`Could not extract channel ID from: ${channelUrl}`);
      return [];
    }

    // Use API manager with data validation
    return await youtubeAPIManager.executeWithDataValidation(
      async (youtubeClient) => {
        // First, get the channel ID if it's a handle
        let actualChannelId = channelId;
        if (channelId.startsWith('@')) {
          try {
            // Try to search for the channel by handle (without @)
            const searchQuery = channelId.substring(1); // Remove the @ symbol
            const searchResponse = await youtubeClient.search.list({
              part: ['snippet'],
              q: searchQuery,
              type: ['channel'],
              maxResults: 5, // Get a few results to find the right one
            });

            if (searchResponse.data.items && searchResponse.data.items.length > 0) {
              // Find the channel that matches the handle
              const matchingChannel = searchResponse.data.items.find((item: youtube_v3.Schema$SearchResult) =>
                item.snippet?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.snippet?.channelTitle?.toLowerCase().includes(searchQuery.toLowerCase())
              );

              if (matchingChannel) {
                actualChannelId = matchingChannel.snippet?.channelId || channelId;
              } else {
                // If no exact match, take the first result
                actualChannelId = searchResponse.data.items[0].snippet?.channelId || channelId;
              }
            } else {
              console.error(`No channels found for search query: ${searchQuery}`);
              return []; // Return empty array to trigger fallback
            }
          } catch (error) {
            console.error(`Error searching for channel ${channelId}:`, error);
            return []; // Return empty array to trigger fallback
          }
        } else if (channelId.startsWith('UC') && channelId.length === 24) {
          // It's already a channel ID
          actualChannelId = channelId;
        }

        // Get channel uploads playlist
        const channelResponse = await youtubeClient.channels.list({
          part: ['contentDetails'],
          id: [actualChannelId],
        });

        if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
          console.error(`Channel not found: ${channelUrl} (ID: ${actualChannelId})`);
          return []; // Return empty array to trigger fallback
        }

        const uploadsPlaylistId = channelResponse.data.items[0].contentDetails?.relatedPlaylists?.uploads;
        if (!uploadsPlaylistId) {
          console.error(`No uploads playlist found for channel: ${channelUrl}`);
          return []; // Return empty array to trigger fallback
        }

        // Get videos from uploads playlist
        const playlistResponse = await youtubeClient.playlistItems.list({
          part: ['snippet', 'contentDetails'],
          playlistId: uploadsPlaylistId,
          maxResults,
        });

        if (!playlistResponse.data.items || playlistResponse.data.items.length === 0) {
          console.error(`No videos found in uploads playlist for channel: ${channelUrl}`);
          return []; // Return empty array to trigger fallback
        }

        const videoIds = playlistResponse.data.items.map((item: youtube_v3.Schema$PlaylistItem) => item.contentDetails?.videoId).filter(Boolean) as string[];

        // Get video details including duration and view count
        const videoResponse = await youtubeClient.videos.list({
          part: ['snippet', 'contentDetails', 'statistics'],
          id: videoIds,
        });

        if (!videoResponse.data.items || videoResponse.data.items.length === 0) {
          return []; // Return empty array to trigger fallback
        }

        return videoResponse.data.items.map((video: youtube_v3.Schema$Video) => ({
          id: video.id!,
          title: video.snippet?.title || 'Untitled',
          description: video.snippet?.description || '',
          thumbnail: video.snippet?.thumbnails?.high?.url || video.snippet?.thumbnails?.default?.url || '',
          duration: parseDuration(video.contentDetails?.duration || 'PT0S'),
          viewCount: formatViewCount(video.statistics?.viewCount || '0'),
          publishedAt: video.snippet?.publishedAt || '',
          channelTitle: video.snippet?.channelTitle || '',
        }));
      },
      (videos: YouTubeVideo[]) => videos.length > 0, // Validate that we got actual videos
      `fetchChannelVideos(${channelUrl})`
    );
  } catch (error) {
    console.error(`Error fetching videos from channel ${channelUrl}:`, error);
    return [];
  }
}

// Fetch videos from a playlist with automatic API key rotation
async function fetchPlaylistVideos(playlistUrl: string, maxResults: number = 10): Promise<YouTubeVideo[]> {
  try {
    const playlistIdMatch = playlistUrl.match(/[?&]list=([^#\&\?]*)/);
    if (!playlistIdMatch) {
      console.error(`Could not extract playlist ID from: ${playlistUrl}`);
      return [];
    }

    const playlistId = playlistIdMatch[1];

    // Use API manager with data validation
    return await youtubeAPIManager.executeWithDataValidation(
      async (youtubeClient) => {
        const response = await youtubeClient.playlistItems.list({
          part: ['snippet', 'contentDetails'],
          playlistId,
          maxResults,
        });

        if (!response.data.items || response.data.items.length === 0) {
          return []; // Return empty array to trigger fallback
        }

        const videoIds = response.data.items.map((item: youtube_v3.Schema$PlaylistItem) => item.contentDetails?.videoId).filter(Boolean) as string[];

        if (videoIds.length === 0) {
          return []; // Return empty array to trigger fallback
        }

        // Get video details
        const videoResponse = await youtubeClient.videos.list({
          part: ['snippet', 'contentDetails', 'statistics'],
          id: videoIds,
        });

        if (!videoResponse.data.items || videoResponse.data.items.length === 0) {
          return []; // Return empty array to trigger fallback
        }

        return videoResponse.data.items.map((video: youtube_v3.Schema$Video) => ({
          id: video.id!,
          title: video.snippet?.title || 'Untitled',
          description: video.snippet?.description || '',
          thumbnail: video.snippet?.thumbnails?.high?.url || video.snippet?.thumbnails?.default?.url || '',
          duration: parseDuration(video.contentDetails?.duration || 'PT0S'),
          viewCount: formatViewCount(video.statistics?.viewCount || '0'),
          publishedAt: video.snippet?.publishedAt || '',
          channelTitle: video.snippet?.channelTitle || '',
        }));
      },
      (videos: YouTubeVideo[]) => videos.length > 0, // Validate that we got actual videos
      `fetchPlaylistVideos(${playlistUrl})`
    );
  } catch (error) {
    console.error(`Error fetching videos from playlist ${playlistUrl}:`, error);
    return [];
  }
}

export async function fetchAllVideos(maxResultsPerSource: number = 5): Promise<YouTubeVideo[]> {
  const cacheKey = `videos-${maxResultsPerSource}`;
  const now = Date.now();

  // Check cache first - be more aggressive with caching
  const cached = apiCache.get(cacheKey);
  if (cached) {
    const cacheAge = now - cached.timestamp;
    const isCacheValid = cached.isQuotaExceeded
      ? cacheAge < QUOTA_EXCEEDED_CACHE_DURATION
      : cacheAge < CACHE_DURATION;

    if (isCacheValid) {
      console.log(`Returning cached videos (cache age: ${Math.round(cacheAge / 60000)} minutes, quota exceeded: ${cached.isQuotaExceeded || false})`);
      return cached.data;
    }
  }

  console.log('Fetching videos from YouTube channels and playlists...');
  console.log('YouTube API Key present:', !!process.env.YOUTUBE_API_KEY);
  console.log('YouTube API Key starts with:', process.env.YOUTUBE_API_KEY?.substring(0, 10) + '...');

  const sources = [
    // Prioritize playlist (cheaper API calls) over individual channels
    'https://www.youtube.com/watch?v=KoZ83cnoZyU&list=PLnfYS3rBXoKSDiGuqF_DUgsfUIDfItqyw&index=12',
    // Only fetch from 2-3 channels instead of 6 to save quota
    'https://www.youtube.com/@jaddukaji-abuzizou',
    'https://www.youtube.com/@islamlavn',
  ];

  const allVideos: YouTubeVideo[] = [];
  let quotaExceeded = false;

  for (const source of sources) {
    if (quotaExceeded) {
      // If quota was exceeded for one source, skip remaining sources
      break;
    }

    try {
      let videos: YouTubeVideo[] = [];

      if (source.includes('list=')) {
        // It's a playlist - fetch more since it's more efficient
        videos = await fetchPlaylistVideos(source, Math.min(maxResultsPerSource * 2, 20)); // Increased max to 20 per playlist
      } else {
        // It's a channel - fetch less to save quota
        videos = await fetchChannelVideos(source, Math.min(maxResultsPerSource, 5)); // Increased max to 5 per channel
      }

      allVideos.push(...videos);
    } catch (error) {
      console.error(`Error fetching from ${source}:`, error);
      // Check if it's a quota exceeded error
      if (error instanceof Error && (error.message.includes('quota') || error.message.includes('exceeded') || error.message.includes('expired'))) {
        console.log('YouTube API quota exceeded or key expired, will use fallback data');
        quotaExceeded = true;
      }
      // Continue with other sources even if one fails
    }
  }

  // If quota was exceeded or no videos found, return empty array
  if (quotaExceeded || allVideos.length === 0) {
    console.log('No videos available due to quota/API issues');
    // Cache empty array with quota exceeded flag for shorter duration
    apiCache.set(cacheKey, { data: [], timestamp: now, isQuotaExceeded: true });
    return [];
  }

  // Remove duplicates based on video ID and sort by published date (newest first)
  const uniqueVideos = allVideos.filter((video, index, self) =>
    index === self.findIndex(v => v.id === video.id)
  );

  console.log(`Successfully fetched ${uniqueVideos.length} unique videos`);

  const sortedVideos = uniqueVideos.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  // Cache the result
  apiCache.set(cacheKey, { data: sortedVideos, timestamp: now, isQuotaExceeded: false });

  return sortedVideos;
}