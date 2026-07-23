import Link from "next/link";
import {
  formatViewCount,
  timeAgo,
  parseDuration,
  getThumbnail,
  getVideoId,
  avatarColor,
} from "../lib/utils";

export default function VideoCard({ video }) {
  if (!video?.snippet) return null;
  const snippet = video.snippet || {};
  const stats = video.statistics || {};
  const dur = parseDuration(video.contentDetails?.duration);
  const thumb = getThumbnail(snippet, "high");
  const vidId = getVideoId(video);
  const initial = (snippet.channelTitle || "U")[0].toUpperCase();
  const href = vidId ? `/watch/${vidId}` : '#';

  return (
    <Link href={href} className="yt-card" style={{ display: 'block', textDecoration: 'none' }}>
      {/* Thumbnail */}
      <div className="thumb-wrap">
        {thumb ? (
          <img src={thumb} alt={snippet.title} loading="lazy" />
        ) : (
          <div style={{ width: "100%", aspectRatio: "16/9", background: "var(--yt-surface)" }} />
        )}
        {dur && <span className="dur">{dur}</span>}
      </div>

      {/* Info */}
      <div className="card-body">
        <div className="ch-avatar" style={{ background: avatarColor(snippet.channelTitle) }}>
          {initial}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="vid-title">{snippet.title}</div>
          <div className="vid-ch">{snippet.channelTitle}</div>
          <div className="vid-meta">
            {stats.viewCount ? formatViewCount(stats.viewCount) : ""}
            {stats.viewCount && snippet.publishedAt ? " • " : ""}
            {snippet.publishedAt ? timeAgo(snippet.publishedAt) : ""}
          </div>
        </div>
      </div>
    </Link>
  );
}
