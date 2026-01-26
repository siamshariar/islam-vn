import { google } from 'googleapis';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

// In-memory cache for API responses
const apiCache = new Map<string, { data: YouTubeVideo[], timestamp: number }>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

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

// Fetch videos from a channel
async function fetchChannelVideos(channelUrl: string, maxResults: number = 10): Promise<YouTubeVideo[]> {
  try {
    const channelId = extractChannelId(channelUrl);
    if (!channelId) {
      console.error(`Could not extract channel ID from: ${channelUrl}`);
      return [];
    }

    // First, get the channel ID if it's a handle
    let actualChannelId = channelId;
    if (channelId.startsWith('@')) {
      try {
        // Try to search for the channel by handle (without @)
        const searchQuery = channelId.substring(1); // Remove the @ symbol
        const searchResponse = await youtube.search.list({
          part: ['snippet'],
          q: searchQuery,
          type: ['channel'],
          maxResults: 5, // Get a few results to find the right one
        });

        if (searchResponse.data.items && searchResponse.data.items.length > 0) {
          // Find the channel that matches the handle
          const matchingChannel = searchResponse.data.items.find(item =>
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
          return [];
        }
      } catch (error) {
        console.error(`Error searching for channel ${channelId}:`, error);
        return [];
      }
    } else if (channelId.startsWith('UC') && channelId.length === 24) {
      // It's already a channel ID
      actualChannelId = channelId;
    }

    // Get channel uploads playlist
    const channelResponse = await youtube.channels.list({
      part: ['contentDetails'],
      id: [actualChannelId],
    });

    if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
      console.error(`Channel not found: ${channelUrl} (ID: ${actualChannelId})`);
      return [];
    }

    const uploadsPlaylistId = channelResponse.data.items[0].contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsPlaylistId) {
      console.error(`No uploads playlist found for channel: ${channelUrl}`);
      return [];
    }

    // Get videos from uploads playlist
    const playlistResponse = await youtube.playlistItems.list({
      part: ['snippet', 'contentDetails'],
      playlistId: uploadsPlaylistId,
      maxResults,
    });

    if (!playlistResponse.data.items || playlistResponse.data.items.length === 0) {
      console.error(`No videos found in uploads playlist for channel: ${channelUrl}`);
      return [];
    }

    const videoIds = playlistResponse.data.items.map(item => item.contentDetails?.videoId).filter(Boolean) as string[];

    // Get video details including duration and view count
    const videoResponse = await youtube.videos.list({
      part: ['snippet', 'contentDetails', 'statistics'],
      id: videoIds,
    });

    if (!videoResponse.data.items) return [];

    return videoResponse.data.items.map(video => ({
      id: video.id!,
      title: video.snippet?.title || 'Untitled',
      description: video.snippet?.description || '',
      thumbnail: video.snippet?.thumbnails?.high?.url || video.snippet?.thumbnails?.default?.url || '',
      duration: parseDuration(video.contentDetails?.duration || 'PT0S'),
      viewCount: formatViewCount(video.statistics?.viewCount || '0'),
      publishedAt: video.snippet?.publishedAt || '',
      channelTitle: video.snippet?.channelTitle || '',
    }));
  } catch (error) {
    console.error(`Error fetching videos from channel ${channelUrl}:`, error);
    return [];
  }
}

// Fetch videos from a playlist
async function fetchPlaylistVideos(playlistUrl: string, maxResults: number = 10): Promise<YouTubeVideo[]> {
  try {
    const playlistIdMatch = playlistUrl.match(/[?&]list=([^#\&\?]*)/);
    if (!playlistIdMatch) {
      console.error(`Could not extract playlist ID from: ${playlistUrl}`);
      return [];
    }

    const playlistId = playlistIdMatch[1];

    const response = await youtube.playlistItems.list({
      part: ['snippet', 'contentDetails'],
      playlistId,
      maxResults,
    });

    if (!response.data.items) return [];

    const videoIds = response.data.items.map(item => item.contentDetails?.videoId).filter(Boolean) as string[];

    // Get video details
    const videoResponse = await youtube.videos.list({
      part: ['snippet', 'contentDetails', 'statistics'],
      id: videoIds,
    });

    if (!videoResponse.data.items) return [];

    return videoResponse.data.items.map(video => ({
      id: video.id!,
      title: video.snippet?.title || 'Untitled',
      description: video.snippet?.description || '',
      thumbnail: video.snippet?.thumbnails?.high?.url || video.snippet?.thumbnails?.default?.url || '',
      duration: parseDuration(video.contentDetails?.duration || 'PT0S'),
      viewCount: formatViewCount(video.statistics?.viewCount || '0'),
      publishedAt: video.snippet?.publishedAt || '',
      channelTitle: video.snippet?.channelTitle || '',
    }));
  } catch (error) {
    console.error(`Error fetching videos from playlist ${playlistUrl}:`, error);
    return [];
  }
}

// Main function to fetch all videos from specified sources
export async function fetchAllVideos(maxResultsPerSource: number = 5): Promise<YouTubeVideo[]> {
  const cacheKey = `videos-${maxResultsPerSource}`;
  const now = Date.now();

  // Check cache first
  const cached = apiCache.get(cacheKey);
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    console.log('Returning cached videos');
    return cached.data;
  }

  console.log('Fetching videos from YouTube channels and playlists...');
  console.log('YouTube API Key present:', !!process.env.YOUTUBE_API_KEY);
  console.log('YouTube API Key starts with:', process.env.YOUTUBE_API_KEY?.substring(0, 10) + '...');

  const sources = [
    'https://www.youtube.com/@islamlavn', // Test with just one channel first
  ];

  const allVideos: YouTubeVideo[] = [];

  for (const source of sources) {
    try {
      let videos: YouTubeVideo[] = [];

      if (source.includes('list=')) {
        // It's a playlist
        videos = await fetchPlaylistVideos(source, maxResultsPerSource);
      } else {
        // It's a channel
        videos = await fetchChannelVideos(source, maxResultsPerSource);
      }

      allVideos.push(...videos);
    } catch (error) {
      console.error(`Error fetching from ${source}:`, error);
    }
  }

  // Remove duplicates based on video ID and sort by published date (newest first)
  const uniqueVideos = allVideos.filter((video, index, self) =>
    index === self.findIndex(v => v.id === video.id)
  );

  console.log(`Successfully fetched ${uniqueVideos.length} unique videos`);

  const sortedVideos = uniqueVideos.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  // Cache the result
  apiCache.set(cacheKey, { data: sortedVideos, timestamp: now });

  return sortedVideos;
}