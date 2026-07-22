export function formatViewCount(n) {
  if (!n) return '0 views';
  const num = parseInt(n, 10);
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B views`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M views`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K views`;
  return `${num} views`;
}

export function formatCount(n) {
  if (!n) return '0';
  const num = parseInt(n, 10);
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return `${num}`;
}

export function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const s = Math.floor(diff / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  const mo = Math.floor(d / 30);
  const y = Math.floor(mo / 12);
  if (y > 0) return `${y} year${y > 1 ? 's' : ''} ago`;
  if (mo > 0) return `${mo} month${mo > 1 ? 's' : ''} ago`;
  if (d > 0) return `${d} day${d > 1 ? 's' : ''} ago`;
  if (h > 0) return `${h} hour${h > 1 ? 's' : ''} ago`;
  if (m > 0) return `${m} minute${m > 1 ? 's' : ''} ago`;
  return 'just now';
}

export function parseDuration(iso) {
  if (!iso) return '';
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return '';
  const h = parseInt(m[1] || 0);
  const min = parseInt(m[2] || 0);
  const sec = parseInt(m[3] || 0);
  if (h > 0) return `${h}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  return `${min}:${String(sec).padStart(2, '0')}`;
}

export function getThumbnail(snippet, quality = 'high') {
  const t = snippet?.thumbnails;
  if (!t) return '';
  // maxres = 1280×720 (16:9) — best quality, no cropping
  return (t.maxres || t[quality] || t.high || t.medium || t.default)?.url || '';
}

export function getVideoId(item) {
  if (!item) return null;
  if (typeof item.id === 'string') return item.id;
  if (item.id?.videoId) return item.id.videoId;
  return null;
}

export function avatarColor(str) {
  const code = (str || 'A').charCodeAt(0);
  return `hsl(${(code * 47) % 360}, 55%, 40%)`;
}
