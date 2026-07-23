import PageLayout from '../components/PageLayout';
import AuthWall from '../components/AuthWall';
import VideoCard from '../components/VideoCard';
import { useStore } from '../lib/store';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function History() {
  const { history } = useStore();

  if (!history?.length) {
    return (
      <PageLayout title="Watch history - YouTube">
        <AuthWall
          section="Watch history"
          description="Videos you watch will appear here. Start watching to build your history!"
        />
      </PageLayout>
    );
  }

  const videos = history.map((v) => ({
    id: v.id,
    snippet: {
      title: v.title,
      channelTitle: v.channelTitle,
      publishedAt: new Date(v.watchedAt).toISOString(),
      thumbnails: { medium: { url: v.thumbnail }, high: { url: v.thumbnail } },
    },
  }));

  return (
    <PageLayout title="Watch history - YouTube">
      <div style={{ padding: '20px 24px 8px', fontSize: 22, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
        🕐 Watch history <span style={{ fontSize: 16, color: 'var(--yt-text-2)', fontWeight: 400 }}>({history.length})</span>
      </div>
      <div className="yt-grid">
        {videos.map((v) => <VideoCard key={v.id} video={v} />)}
      </div>
    </PageLayout>
  );
}
