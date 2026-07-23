import { useState, useEffect, useRef, useCallback } from 'react';
import useSWR from 'swr';
import PageLayout from '../components/PageLayout';
import VideoCard from '../components/VideoCard';
import VideoCardSkeleton from '../components/VideoCardSkeleton';
import CategoryFilter from '../components/CategoryFilter';
import { ytFetcher, API } from '../lib/youtube';
import { getVideoId } from '../lib/utils';

const PAGE_SIZE = 16;

export default function Home() {
  const [category, setCategory] = useState('all');
  const [videos, setVideos] = useState([]);
  const [nextPageToken, setNextPageToken] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialDone, setInitialDone] = useState(false);
  const loaderRef = useRef(null);

  // Initial fetch via SWR (cached)
  const firstEndpoint =
    category === 'all'
      ? API.trending('IN', PAGE_SIZE)
      : API.categoryVideos(category, 'IN', PAGE_SIZE);

  const { data: firstPage, error, isLoading } = useSWR(firstEndpoint, ytFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300_000,
  });

  // Reset when category changes
  useEffect(() => {
    setVideos([]);
    setNextPageToken('');
    setInitialDone(false);
  }, [category]);

  // Populate first page
  useEffect(() => {
    if (firstPage && !initialDone) {
      setVideos((firstPage.items || []).filter((v) => v?.snippet));
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

  const endpoint =
    category === "all"
      ? API.trending("IN", 24)
      : API.categoryVideos(category, "IN", 24);

  const { data, error, isLoading } = useSWR(endpoint, ytFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300_000,
  });

  const videos = (data?.items || []).filter((v) => v?.snippet);

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
        <div className="yt-grid">
          {isLoading
            ? Array.from({ length: 20 }).map((_, i) => (
                <VideoCardSkeleton key={i} />
              ))
            : videos.map((v) => (
                <VideoCard key={getVideoId(v) || Math.random()} video={v} />
              ))}
        </div>
      )}
    </PageLayout>
  );
}
