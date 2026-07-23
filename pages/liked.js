import PageLayout from '../components/PageLayout';
import AuthWall from '../components/AuthWall';
import VideoCard from '../components/VideoCard';
import { useStore } from '../lib/store';

export default function Liked() {
  const { likes } = useStore();
  const items = Object.values(likes || {}).reverse();

  if (items.length === 0) {
    return (
      <PageLayout title="Liked videos - YouTube">
        <AuthWall
          section="Liked videos"
          description="Like videos to add them here. Videos you like will be saved to this playlist."
        />
      </PageLayout>
    );
  }

  // Reshape stored data into the same shape VideoCard expects
  const videos = items.map((v) => ({
    id: v.id,
    snippet: {
      title: v.title,
      channelTitle: v.channelTitle,
      publishedAt: v.publishedAt,
      thumbnails: { medium: { url: v.thumbnail }, high: { url: v.thumbnail } },
    },
  }));

  return (
    <PageLayout title="Liked videos - YouTube">
      <div style={{ padding: '20px 24px 8px', fontSize: 22, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
        ❤️ Liked videos <span style={{ fontSize: 16, color: 'var(--yt-text-2)', fontWeight: 400 }}>({items.length})</span>
      </div>
      <div className="yt-grid">
        {videos.map((v) => <VideoCard key={v.id} video={v} />)}
      </div>
    </PageLayout>
  );
}
