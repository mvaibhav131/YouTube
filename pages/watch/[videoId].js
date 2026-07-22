import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import {
  LikeOutlined, LikeFilled, DislikeOutlined,
  ShareAltOutlined, DownloadOutlined, EllipsisOutlined,
  CheckCircleFilled, BellFilled,
} from '@ant-design/icons';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { ytFetcher, API } from '../../lib/youtube';import {
  formatViewCount, formatCount, timeAgo, parseDuration,
  getThumbnail, getVideoId, avatarColor,
} from '../../lib/utils';

// ── Related video card ─────────────────────────────────────────────────────
function RelCard({ video }) {
  const router  = useRouter();
  if (!video?.snippet) return null;          // null guard
  const sn      = video.snippet || {};
  const vidId   = getVideoId(video);
  const thumb   = getThumbnail(sn, 'medium');
  const dur     = parseDuration(video.contentDetails?.duration);
  const stats   = video.statistics || {};

  return (
    <div className="yt-rel-card" onClick={() => vidId && router.push(`/watch/${vidId}`)}>
      <div className="yt-rel-thumb">
        {thumb && <img src={thumb} alt={sn.title} loading="lazy" />}
        {dur && (
          <span className="dur" style={{ position: 'absolute', bottom: 4, right: 4 }}>{dur}</span>
        )}
      </div>
      <div className="yt-rel-info">
        <div className="yt-rel-title">{sn.title}</div>
        <div className="yt-rel-meta">{sn.channelTitle}</div>
        <div className="yt-rel-meta">
          {stats.viewCount ? formatViewCount(stats.viewCount) : ''}
          {sn.publishedAt ? ` • ${timeAgo(sn.publishedAt)}` : ''}
        </div>
      </div>
    </div>
  );
}

// ── Real + fallback comment section ────────────────────────────────────────
const FALLBACK_COMMENTS = [
  { user: 'Rahul Sharma',  av: 'RS', text: 'Bhai ye video ekdum mast hai! Kaafi helpful 🔥 Keep it up!',             likes: '14.2K', time: '2 days ago',   replies: 43  },
  { user: 'Priya Gupta',  av: 'PG', text: 'Finally samajh aaya! Bohot ache se explain kiya hai. Thank you 🙏',      likes: '9.8K',  time: '3 days ago',   replies: 18  },
  { user: 'Amit Kumar',   av: 'AK', text: 'This is exactly what I needed. Immediately subscribed!',                 likes: '7.1K',  time: '5 days ago',   replies: 12  },
  { user: 'Sneha Patel',  av: 'SP', text: 'Sir please iska part 2 bhi banao 🙏 bohot kuch sikhna baki hai',         likes: '5.4K',  time: '1 week ago',   replies: 31  },
  { user: 'Vikram Singh', av: 'VS', text: 'Watched this 3 times and still learning something new each time 😅',    likes: '4.2K',  time: '1 week ago',   replies: 7   },
  { user: 'Kavya Reddy',  av: 'KR', text: 'The explanation is so clear and concise. Production quality is 🔥👏',   likes: '3.7K',  time: '2 weeks ago',  replies: 5   },
  { user: 'Arjun Nair',   av: 'AN', text: 'Pure gold content. Ye channel toh ek hidden gem hai bhai 💎',            likes: '2.9K',  time: '2 weeks ago',  replies: 9   },
  { user: 'Neha Joshi',   av: 'NJ', text: 'Bilkul sahi cheez share kiya! Mera kaafi time bachaya, thank you 😊',   likes: '2.3K',  time: '3 weeks ago',  replies: 4   },
  { user: 'Dev Patel',    av: 'DP', text: 'Just stumbled across this video and I am SO glad I did. Fantastic!',    likes: '1.8K',  time: '3 weeks ago',  replies: 2   },
  { user: 'Ananya Singh', av: 'AS', text: 'You deserve way more subscribers. The effort visible in each video 🙌',  likes: '1.5K',  time: '1 month ago',  replies: 6   },
];

function decodeHtml(str) {
  return str
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '');
}

function CommentSection({ videoId, commentCount }) {
  const { data: cData, error: cError } = useSWR(
    videoId ? API.comments(videoId, 20) : null,
    ytFetcher,
    { revalidateOnFocus: false, dedupingInterval: 300_000 }
  );

  const realComments = !cError && cData?.items?.length > 0
    ? cData.items.filter(c => c?.snippet?.topLevelComment?.snippet)
    : null;
  const total = cData?.pageInfo?.totalResults || commentCount;

  return (
    <div className="yt-comments">
      <div className="yt-comment-count">{formatCount(total || 0)} Comments</div>

      {/* Add comment box */}
      <div className="yt-comment-input-wrap">
        <div className="yt-avatar" style={{ flexShrink: 0, fontSize: 14 }}>V</div>
        <input className="yt-comment-input" placeholder="Add a comment…" aria-label="Add a comment" />
      </div>

      {/* Real comments */}
      {realComments &&
        realComments.map((c) => {
          const sn = c?.snippet?.topLevelComment?.snippet;
          if (!sn) return null;
          const text = sn.textOriginal || decodeHtml(sn.textDisplay || '');
          const replyCount = c?.snippet?.totalReplyCount || 0;
          return (
            <div key={c.id} className="yt-comment">
              <div
                className="yt-comment-avatar"
                style={{ background: avatarColor(sn.authorDisplayName), overflow: 'hidden' }}
              >
                {sn.authorProfileImageUrl ? (
                  <img src={sn.authorProfileImageUrl} alt={sn.authorDisplayName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  sn.authorDisplayName?.[0]?.toUpperCase() || '?'
                )}
              </div>
              <div>
                <div className="yt-comment-header">
                  <span className="yt-comment-user">{sn.authorDisplayName}</span>
                  <span className="yt-comment-time">{timeAgo(sn.publishedAt)}</span>
                </div>
                <div className="yt-comment-body" style={{ whiteSpace: 'pre-line' }}>{text}</div>
                <div className="yt-comment-actions">
                  <span className="yt-comment-act"><LikeOutlined /> {formatCount(sn.likeCount || 0)}</span>
                  <span className="yt-comment-act"><DislikeOutlined /></span>
                  {replyCount > 0 && (
                    <span className="yt-comment-act" style={{ color: 'var(--yt-blue)' }}>
                      ↩ {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

      {/* Fallback mock comments */}
      {!realComments &&
        FALLBACK_COMMENTS.map((c, i) => (
          <div key={i} className="yt-comment">
            <div className="yt-comment-avatar" style={{ background: avatarColor(c.user) }}>
              {c.av}
            </div>
            <div>
              <div className="yt-comment-header">
                <span className="yt-comment-user">{c.user}</span>
                <span className="yt-comment-time">{c.time}</span>
              </div>
              <div className="yt-comment-body">{c.text}</div>
              <div className="yt-comment-actions">
                <span className="yt-comment-act"><LikeOutlined /> {c.likes}</span>
                <span className="yt-comment-act"><DislikeOutlined /></span>
                <span className="yt-comment-act" style={{ color: 'var(--yt-blue)' }}>
                  ↩ {c.replies} replies
                </span>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

// ── Skeleton for watch page ────────────────────────────────────────────────
function WatchSkeleton() {
  return (
    <div style={{ padding: 24 }}>
      <div className="yt-skel-thumb" style={{ borderRadius: 12, marginBottom: 16 }} />
      <div className="yt-skel" style={{ height: 24, width: '72%', marginBottom: 12 }} />
      <div className="yt-skel" style={{ height: 16, width: '40%', marginBottom: 16 }} />
      <div className="yt-skel" style={{ height: 56, borderRadius: 12 }} />
    </div>
  );
}

// ── Main watch page ────────────────────────────────────────────────────────
export default function WatchPage() {
  const router   = useRouter();
  const { videoId } = router.query;

  const [sidebar,     setSidebar]     = useState('hidden');
  const [descOpen,    setDescOpen]    = useState(false);
  const [liked,       setLiked]       = useState(false);
  const [subscribed,  setSubscribed]  = useState(false);

  useEffect(() => {
    if (window.innerWidth >= 1280) setSidebar('mini');
  }, []);

  const toggleMenu = () =>
    setSidebar((s) => (s === 'mini' ? 'hidden' : 'mini'));

  // Video details — pure CSR, no SSR blocking (keeps autoplay gesture fresh)
  const { data: vData, isLoading: vLoading } = useSWR(
    videoId ? API.videoDetails(videoId) : null,
    ytFetcher,
    { revalidateOnFocus: false, dedupingInterval: 300_000 }
  );

  const video   = vData?.items?.[0];
  const sn      = video?.snippet     || {};
  const stats   = video?.statistics  || {};

  // Channel details
  const { data: chData } = useSWR(
    sn.channelId ? API.channel(sn.channelId) : null,
    ytFetcher,
    { revalidateOnFocus: false, dedupingInterval: 600_000 }
  );
  const channel   = chData?.items?.[0];
  const chSn      = channel?.snippet    || {};
  const chStats   = channel?.statistics || {};

  // Related videos — search by title keywords
  const searchQ = sn.title ? sn.title.split(' ').slice(0, 5).join(' ') : '';
  const { data: relData } = useSWR(
    searchQ ? API.relatedSearch(searchQ, 15) : null,
    ytFetcher,
    { revalidateOnFocus: false, dedupingInterval: 300_000 }
  );
  const related = (relData?.items || [])
    .filter(v => v?.snippet)                   // remove null/incomplete items
    .filter((v) => getVideoId(v) !== videoId);

  const tags      = (sn.tags || []).slice(0, 6);
  const pubDate   = sn.publishedAt
    ? new Date(sn.publishedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return (
    <>
      <Head>
        <title>{sn.title ? `${sn.title} - YouTube` : 'YouTube'}</title>
        {sn.description && (
          <meta name="description" content={sn.description.slice(0, 160)} />
        )}
      </Head>

      <Header onMenuClick={toggleMenu} />
      <Sidebar state={sidebar} onOverlayClick={() => setSidebar('hidden')} />

      <main className={`yt-main ${
        sidebar === 'expanded' ? 'sidebar-expanded' :
        sidebar === 'mini'     ? 'sidebar-mini'     : ''
      }`}>
        <div className="yt-watch-wrap">

          {/* ── Primary column ───────────────────────────────────────────── */}
          <div className="yt-watch-primary">

            {/* Player renders IMMEDIATELY — before API data loads so the
                user-gesture (click) is still valid for autoplay */}
            <div className="yt-player">
              {videoId && (
                <iframe
                  key={videoId}
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&modestbranding=1&enablejsapi=1`}
                  title={sn.title || 'YouTube video'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              )}
            </div>

            {/* Metadata — skeleton until API responds */}
            {vLoading ? (
              <div style={{ padding: '12px 0' }}>
                <div className="yt-skel" style={{ height: 24, width: '72%', marginBottom: 12 }} />
                <div className="yt-skel" style={{ height: 16, width: '40%', marginBottom: 16 }} />
                <div className="yt-skel" style={{ height: 56, borderRadius: 12 }} />
              </div>
            ) : (
              <>
                <h1 className="yt-watch-title">{sn.title}</h1>

                {/* Actions */}
                <div className="yt-action-bar">
                  <div className="yt-action-group">
                    <button
                      className={`yt-like-btn${liked ? ' liked' : ''}`}
                      onClick={() => setLiked((v) => !v)}
                      aria-label="Like"
                    >
                      {liked
                        ? <LikeFilled style={{ fontSize: 18 }} />
                        : <LikeOutlined style={{ fontSize: 18 }} />}
                      <span>{formatCount(stats.likeCount || 0)}</span>
                    </button>
                    <button className="yt-dislike-btn" aria-label="Dislike">
                      <DislikeOutlined style={{ fontSize: 18 }} />
                    </button>
                  </div>
                  <div className="yt-action-group">
                    <button className="yt-btn"><ShareAltOutlined /> Share</button>
                    <button className="yt-btn"><DownloadOutlined /> Download</button>
                    <button className="yt-btn" style={{ padding: '8px 12px' }}>
                      <EllipsisOutlined style={{ fontSize: 20 }} />
                    </button>
                  </div>
                </div>

                <div className="yt-watch-meta">
                  {formatViewCount(stats.viewCount)}
                  {sn.publishedAt ? `  •  ${timeAgo(sn.publishedAt)}` : ''}
                </div>

                {/* Channel strip */}
                <div className="yt-ch-strip">
                  <div className="yt-ch-img" style={{ background: avatarColor(sn.channelTitle), overflow: 'hidden' }}>
                    {chSn.thumbnails?.default?.url ? (
                      <img src={chSn.thumbnails.default.url} alt={sn.channelTitle}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      (sn.channelTitle || 'U')[0].toUpperCase()
                    )}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span className="yt-ch-name">{sn.channelTitle}</span>
                      <CheckCircleFilled style={{ color: '#aaa', fontSize: 14 }} />
                    </div>
                    <div className="yt-ch-subs">
                      {chStats.subscriberCount
                        ? `${formatCount(chStats.subscriberCount)} subscribers`
                        : ''}
                    </div>
                  </div>
                  <button
                    className={`yt-sub-btn${subscribed ? ' subscribed' : ''}`}
                    onClick={() => setSubscribed((v) => !v)}
                  >
                    {subscribed
                      ? <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <BellFilled style={{ fontSize: 14 }} /> Subscribed
                        </span>
                      : 'Subscribe'}
                  </button>
                </div>

                {/* Description */}
                <div className="yt-desc-box" onClick={() => setDescOpen((v) => !v)}>
                  <div className="yt-desc-stats">
                    {formatViewCount(stats.viewCount)}&nbsp;&nbsp;{pubDate}
                  </div>
                  {tags.length > 0 && (
                    <div className="yt-desc-tags">{tags.map((t) => `#${t}`).join('  ')}</div>
                  )}
                  <div className="yt-desc-body" style={{ maxHeight: descOpen ? 'none' : 80 }}>
                    {sn.description || 'No description available.'}
                  </div>
                  <div className="yt-desc-toggle">{descOpen ? 'Show less' : 'Show more'}</div>
                </div>

                {/* Comments */}
                <CommentSection videoId={videoId} commentCount={stats.commentCount} />
              </>
            )}
          </div>

          {/* ── Related videos sidebar ───────────────────────────────────── */}
          <div className="yt-watch-secondary">
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12, color: '#aaa' }}>
              Up next
            </div>
            {related.length === 0
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="yt-rel-card" style={{ pointerEvents: 'none' }}>
                    <div className="yt-skel" style={{ width: 168, flexShrink: 0, aspectRatio: '16/9', borderRadius: 8 }} />
                    <div style={{ flex: 1 }}>
                      <div className="yt-skel" style={{ height: 12, marginBottom: 6, width: '90%' }} />
                      <div className="yt-skel" style={{ height: 12, marginBottom: 4, width: '70%' }} />
                      <div className="yt-skel" style={{ height: 12, width: '50%' }} />
                    </div>
                  </div>
                ))
              : related.map((v) => (
                  <RelCard key={getVideoId(v) || Math.random()} video={v} />
                ))}
          </div>
        </div>

        <Footer />
      </main>
    </>
  );
}


