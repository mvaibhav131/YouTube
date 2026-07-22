import { useRouter } from 'next/router';
import { formatViewCount, timeAgo, parseDuration, getThumbnail, getVideoId, avatarColor } from '../lib/utils';

export default function VideoCard({ video }) {
  const router = useRouter();
  const snippet = video.snippet || {};
  const stats   = video.statistics || {};
  const dur     = parseDuration(video.contentDetails?.duration);
  const thumb   = getThumbnail(snippet, 'high');
  const vidId   = getVideoId(video);
  const initial = (snippet.channelTitle || 'U')[0].toUpperCase();

  return (
    <div
      className="yt-card"
      onClick={() => vidId && router.push(`/watch/${vidId}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && vidId && router.push(`/watch/${vidId}`)}
    >
      {/* Thumbnail */}
      <div className="thumb-wrap">
        {thumb
          ? <img src={thumb} alt={snippet.title} loading="lazy" />
          : <div style={{ width: '100%', aspectRatio: '16/9', background: 'var(--yt-surface)' }} />
        }
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
            {stats.viewCount ? formatViewCount(stats.viewCount) : ''}
            {stats.viewCount && snippet.publishedAt ? ' • ' : ''}
            {snippet.publishedAt ? timeAgo(snippet.publishedAt) : ''}
          </div>
        </div>
      </div>
    </div>
  );
}
