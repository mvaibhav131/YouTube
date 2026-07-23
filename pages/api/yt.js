const API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

// Route builders — all params are validated before building the URL
const HANDLERS = {
  trending: (p) => {
    const region = /^[A-Z]{2}$/.test(p.regionCode || "") ? p.regionCode : "IN";
    const max = Math.min(Math.max(parseInt(p.maxResults) || 16, 1), 50);
    const cat =
      p.categoryId && /^\d{1,3}$/.test(p.categoryId)
        ? `&videoCategoryId=${p.categoryId}`
        : "";
    // pageToken for pagination (base64-like chars only)
    const pt =
      p.pageToken && /^[a-zA-Z0-9_\-=+/]+$/.test(p.pageToken)
        ? `&pageToken=${encodeURIComponent(p.pageToken)}`
        : "";
    return `/videos?part=snippet,statistics,contentDetails&chart=mostPopular&regionCode=${region}&maxResults=${max}${cat}${pt}`;
  },

  search: (p) => {
    if (!p.q) return null;
    const q = String(p.q).slice(0, 200);
    const max = Math.min(Math.max(parseInt(p.maxResults) || 24, 1), 50);
    // regionCode=IN + relevanceLanguage=hi ensures results match Indian users
    // regardless of which server/CDN node handles the request (Netlify uses US servers)
    return `/search?part=snippet&q=${encodeURIComponent(q)}&type=video&maxResults=${max}&order=relevance&regionCode=IN&relevanceLanguage=hi`;
  },

  video: (p) => {
    if (!p.id || !/^[a-zA-Z0-9_-]{6,20}$/.test(p.id)) return null;
    return `/videos?part=snippet,statistics,contentDetails&id=${p.id}`;
  },

  channel: (p) => {
    if (!p.id || !/^[a-zA-Z0-9_-]{6,30}$/.test(p.id)) return null;
    return `/channels?part=snippet,statistics&id=${p.id}`;
  },

  comments: (p) => {
    if (!p.videoId || !/^[a-zA-Z0-9_-]{6,20}$/.test(p.videoId)) return null;
    const max = Math.min(Math.max(parseInt(p.maxResults) || 20, 1), 50);
    return `/commentThreads?part=snippet&videoId=${p.videoId}&maxResults=${max}&order=relevance`;
  },
};

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!API_KEY) {
    return res.status(500).json({ error: "Server configuration error" });
  }

  const { type, ...params } = req.query;

  if (!type || !HANDLERS[type]) {
    return res.status(400).json({ error: "Invalid request type" });
  }

  const path = HANDLERS[type](params);
  if (!path) {
    return res.status(400).json({ error: "Invalid parameters" });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);

  try {
    // Cache-Control TTL: 45s for trending, no-cache for search (each query unique)
    const ttl = type === "trending" ? 45 : type === "search" ? 0 : 120;

    // NOTE: next: { revalidate } is NOT used here — it mis-keys the cache in
    // Next.js API routes on Netlify (serverless). Cache-Control header is enough.
    const ytRes = await fetch(`${BASE_URL}${path}&key=${API_KEY}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      cache: "no-store", // always hit YouTube API fresh; Cache-Control handles CDN
    });
    clearTimeout(timer);

    const data = await ytRes.json();

    if (ttl > 0) {
      res.setHeader(
        "Cache-Control",
        `s-maxage=${ttl}, stale-while-revalidate=30`,
      );
    } else {
      // search: no CDN cache — every query must return unique results
      res.setHeader("Cache-Control", "no-store");
    }
    return res.status(ytRes.status).json(data);
  } catch (err) {
    clearTimeout(timer);
    console.error(`[YouTube proxy] ${type}:`, err.message);
    return res.status(500).json({ error: "Failed to fetch data" });
  }
}
