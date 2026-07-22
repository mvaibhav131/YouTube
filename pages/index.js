import { useState } from "react";
import useSWR from "swr";
import PageLayout from "../components/PageLayout";
import VideoCard from "../components/VideoCard";
import VideoCardSkeleton from "../components/VideoCardSkeleton";
import CategoryFilter from "../components/CategoryFilter";
import { ytFetcher, API } from "../lib/youtube";
import { getVideoId } from "../lib/utils";

export default function Home() {
  const [category, setCategory] = useState("all");

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
