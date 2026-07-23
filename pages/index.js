import { useState, useEffect, useRef, useCallback } from 'react';
import useSWR from 'swr';
import PageLayout from '../components/PageLayout';
import VideoCard from '../components/VideoCard';
import VideoCardSkeleton from '../components/VideoCardSkeleton';
import CategoryFilter from '../components/CategoryFilter';
import { ytFetcher, API } from '../lib/youtube';
import { getVideoId } from '../lib/utils';

const PAGE_SIZE = 16;
const FETCH_SIZE = 50; // Fetch more than we show so we can shuffle for variety

// Fisher-Yates shuffle — different order every reload
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Home() {
  const [category, setCategory] = useState('all');
  const [videos, setVideos] = useState([]);
  const [nextPageToken, setNextPageToken] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialDone, setInitialDone] = useState(false);
  const loaderRef = useRef(null);

  // Initial fetch via SWR — short 45s dedup to match server revalidate
  const firstEndpoint =
    category === 'all'
      ? API.trending('IN', FETCH_SIZE)
      : API.categoryVideos(category, 'IN', FETCH_SIZE);

  const { data: firstPage, error, isLoading } = useSWR(firstEndpoint, ytFetcher, {
    revalidateOnFocus: true,       // refetch when tab gets focus
    revalidateOnReconnect: true,
    dedupingInterval: 45_000,      // matches server revalidate (45s)
  });

  // Reset when category changes
  useEffect(() => {
    setVideos([]);
    setNextPageToken('');
    setInitialDone(false);
  }, [category]);

  // Populate first page — shuffle for variety on each load
  useEffect(() => {
    if (firstPage && !initialDone) {
      const all = (firstPage.items || []).filter((v) => v?.snippet);
      const shuffled = shuffle(all);            // different order every reload
      setVideos(shuffled.slice(0, PAGE_SIZE));  // show first 16
      setNextPageToken(firstPage.nextPageToken || '');
      setInitialDone(true);
    }
  }, [firstPage, initialDone]);

  // Load next page
  const loadMore = useCallback(async () => {
    if (loadingMore || !nextPageToken) return;
    setLoadingMore(true);
    try {
      const url =
        (category === 'all'
          ? API.trending('IN', PAGE_SIZE)
          : API.categoryVideos(category, 'IN', PAGE_SIZE)) +
        `&pageToken=${encodeURIComponent(nextPageToken)}`;
      const data = await ytFetcher(url);
      setVideos((prev) => [
        ...prev,
        ...(data?.items || []).filter((v) => v?.snippet),
      ]);
      setNextPageToken(data?.nextPageToken || '');
    } catch {
      setNextPageToken('');
    }
    setLoadingMore(false);
  }, [loadingMore, nextPageToken, category]);

  // IntersectionObserver — fires loadMore when loader div enters viewport
  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore(); },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <PageLayout title="YouTube">
      <CategoryFilter active={category} onChange={setCategory} />

      {error && (
        <div className="yt-empty">
          <div className="yt-empty-icon">😕</div>
          <div className="yt-empty-title">Could not load videos</div>
          <div className="yt-empty-sub">Check your API key in .env.local</div>
        </div>
      )}

      {!error && (
        <>
          <div className="yt-grid">
            {isLoading
              ? Array.from({ length: PAGE_SIZE }).map((_, i) => <VideoCardSkeleton key={i} />)
              : videos.map((v) => (
                  <VideoCard key={getVideoId(v) || Math.random()} video={v} />
                ))}
          </div>

          {/* Infinite scroll trigger + loading indicator */}
          <div ref={loaderRef} className="yt-load-more">
            {loadingMore && (
              <>
                <div className="yt-load-spinner" />
                <span>Loading more…</span>
              </>
            )}
          </div>
        </>
      )}
    </PageLayout>
  );
}

export async function getServerSideProps() { return { props: {} }; }
