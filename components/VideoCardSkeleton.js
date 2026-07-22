export default function VideoCardSkeleton() {
  return (
    <div className="yt-card">
      <div className="yt-skel-thumb" />
      <div className="card-body">
        <div className="yt-skel" style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="yt-skel" style={{ height: 14, marginBottom: 8, width: '88%' }} />
          <div className="yt-skel" style={{ height: 13, marginBottom: 6, width: '65%' }} />
          <div className="yt-skel" style={{ height: 12, width: '48%' }} />
        </div>
      </div>
    </div>
  );
}
