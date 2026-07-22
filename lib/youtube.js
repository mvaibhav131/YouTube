/**
 * YouTube API utilities
 * All API calls are proxied through /api/yt — key stays server-side only.
 */

// ── Client-side URL builders (also used as SWR cache keys) ──────────────────
export const API = {
  trending: (regionCode = 'IN', maxResults = 24) =>
    `/api/yt?type=trending&regionCode=${regionCode}&maxResults=${maxResults}`,

  categoryVideos: (categoryId, regionCode = 'IN', maxResults = 24) =>
    `/api/yt?type=trending&regionCode=${regionCode}&maxResults=${maxResults}&categoryId=${categoryId}`,

  search: (q, maxResults = 24) =>
    `/api/yt?type=search&q=${encodeURIComponent(String(q))}&maxResults=${maxResults}`,

  videoDetails: (id) => `/api/yt?type=video&id=${id}`,

  channel: (id) => `/api/yt?type=channel&id=${id}`,

  relatedSearch: (q, maxResults = 15) =>
    `/api/yt?type=search&q=${encodeURIComponent(
      String(q).split(' ').slice(0, 5).join(' ')
    )}&maxResults=${maxResults}`,

  comments: (videoId, maxResults = 20) =>
    `/api/yt?type=comments&videoId=${videoId}&maxResults=${maxResults}`,
};

// ── SWR-compatible fetcher ───────────────────────────────────────────────────
export const ytFetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('Request failed');
    error.status = res.status;
    throw error;
  }
  return res.json();
};

// ── Server-side fetchers (used in getServerSideProps) ───────────────────────
const YT_BASE = 'https://www.googleapis.com/youtube/v3';

async function serverFetch(path) {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`${YT_BASE}${path}&key=${key}`, {
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    return res.json();
  } catch {
    clearTimeout(timer);
    return null;
  }
}

export async function fetchVideoDetails(videoId) {
  if (!videoId || !/^[a-zA-Z0-9_-]{6,20}$/.test(videoId)) return null;
  return serverFetch(`/videos?part=snippet,statistics,contentDetails&id=${videoId}`);
}

export async function fetchChannelDetails(channelId) {
  if (!channelId || !/^[a-zA-Z0-9_-]{6,30}$/.test(channelId)) return null;
  return serverFetch(`/channels?part=snippet,statistics&id=${channelId}`);
}
