import { useRouter } from 'next/router';
import useSWR from 'swr';
import { CheckCircleFilled } from '@ant-design/icons';
import PageLayout from '../components/PageLayout';
import { ytFetcher, API } from '../lib/youtube';
import { getThumbnail, getVideoId, timeAgo, avatarColor } from '../lib/utils';

function ResultSkeleton() {
  return (
    <div className="yt-res-card" style={{ pointerEvents: 'none' }}>
      <div className="yt-skel" style={{ width: 320, flexShrink: 0, aspectRatio: '16/9', borderRadius: 12 }} />
      <div style={{ flex: 1, paddingTop: 4 }}>
        <div className="yt-skel" style={{ height: 20, marginBottom: 10, width: '80%' }} />
        <div className="yt-skel" style={{ height: 13, marginBottom: 8, width: '40%' }} />
        <div className="yt-skel" style={{ height: 12, width: '60%' }} />
      </div>
    </div>
  );
}

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;

  const { data, error, isLoading } = useSWR(
    router.isReady && q ? API.search(q, 20) : null,
    ytFetcher,
    { revalidateOnFocus: false, dedupingInterval: 60_000 }
  );

  const results = data?.items || [];

  return (
    <PageLayout title={q ? q + ' - YouTube' : 'Search - YouTube'} defaultSidebar="mini">
      {error && (
        <div className="yt-empty">
          <div className="yt-empty-title">Search failed</div>
          <div className="yt-empty-sub">Check your API key or try again later.</div>
        </div>
      )}

      <div className="yt-results">
        {!q && !isLoading && (
          <div className="yt-empty">
            <div className="yt-empty-title">Search for something</div>
            <div className="yt-empty-sub">Type in the search bar above to find videos.</div>
          </div>
        )}

        {isLoading && Array.from({ length: 8 }).map((_, i) => <ResultSkeleton key={i} />)}

        {!isLoading &&
          results.map((item) => {
            const videoId = getVideoId(item);
            const thumb = getThumbnail(item.snippet, 'high');
            const ch = item.snippet?.channelTitle || '';
            return (
              <div
                key={videoId}
                className="yt-res-card"
                onClick={() => videoId && router.push('/watch/' + videoId)}
              >
                <div className="yt-res-thumb">
                  {thumb && <img src={thumb} alt={item.snippet.title} loading="lazy" />}
                </div>
                <div className="yt-res-info">
                  <div className="yt-res-title">{item.snippet.title}</div>
                  <div className="yt-res-meta">
                    {item.snippet.publishedAt ? timeAgo(item.snippet.publishedAt) : ''}
                  </div>
                  <div className="yt-res-ch">
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: avatarColor(ch),
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0,
                    }}>
                      {(ch || 'U')[0].toUpperCase()}
                    </div>
                    <span className="yt-rel-meta">{ch}</span>
                    <CheckCircleFilled style={{ color: '#717171', fontSize: 12 }} />
                  </div>
                  <div className="yt-res-desc">{item.snippet.description}</div>
                </div>
              </div>
            );
          })}
      </div>
    </PageLayout>
  );
}

export async function getServerSideProps() {
  return { props: {} };
}