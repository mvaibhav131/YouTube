import useSWR from 'swr';
import VideoCard from './VideoCard';
import VideoCardSkeleton from './VideoCardSkeleton';
import { ytFetcher, API } from '../lib/youtube';
import { getVideoId } from '../lib/utils';

export default function CategoryFeed({ categoryId, query, title, icon, regionCode = 'IN' }) {
  const endpoint = query
    ? API.search(query, 24)
    : categoryId
    ? API.categoryVideos(categoryId, regionCode, 24)
    : API.trending(regionCode, 24);

  const { data, error, isLoading } = useSWR(endpoint, ytFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300_000,
  });

  const videos = data?.items || [];

  return (
    <>
      {title && (
        <div style={{
          padding: '20px 24px 8px',
          fontSize: 22, fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          {icon && <span style={{ fontSize: 26 }}>{icon}</span>}
          {title}
        </div>
      )}

      {error && (
        <div className="yt-empty">
          <div className="yt-empty-icon">😕</div>
          <div className="yt-empty-title">Couldn&apos;t load videos</div>
          <div className="yt-empty-sub">Check your API key or try again later.</div>
        </div>
      )}

      {!error && (
        <div className="yt-grid">
          {isLoading
            ? Array.from({ length: 20 }).map((_, i) => <VideoCardSkeleton key={i} />)
            : videos.map((v) => (
                <VideoCard key={getVideoId(v) || Math.random()} video={v} />
              ))}
        </div>
      )}
    </>
  );
}
