import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  HomeOutlined,
  ThunderboltOutlined,
  PlaySquareOutlined,
  HistoryOutlined,
  LikeOutlined,
  FolderOpenOutlined,
  FireOutlined,
  CustomerServiceOutlined,
  TrophyOutlined,
  GlobalOutlined,
  VideoCameraOutlined,
  BookOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

const MAIN = [
  { icon: HomeOutlined,       label: 'Home',          href: '/'             },
  { icon: ThunderboltOutlined,label: 'Shorts',         href: '/shorts'       },
  { icon: PlaySquareOutlined, label: 'Subscriptions',  href: '/subscriptions'},
];

const YOU = [
  { icon: HistoryOutlined,    label: 'History',        href: '/history'      },
  { icon: PlaySquareOutlined, label: 'Playlists',      href: '/playlists'    },
  { icon: ClockCircleOutlined,label: 'Watch later',    href: '/watch-later'  },
  { icon: LikeOutlined,       label: 'Liked videos',   href: '/liked'        },
  { icon: FolderOpenOutlined, label: 'Downloads',      href: '/downloads'    },
];

const EXPLORE = [
  { icon: FireOutlined,           label: 'Trending',  href: '/trending'  },
  { icon: CustomerServiceOutlined,label: 'Music',     href: '/music'     },
  { icon: TrophyOutlined,         label: 'Sports',    href: '/sports'    },
  { icon: VideoCameraOutlined,    label: 'Gaming',    href: '/gaming'    },
  { icon: GlobalOutlined,         label: 'News',      href: '/news'      },
  { icon: BookOutlined,           label: 'Learning',  href: '/learning'  },
];

function SideItem({ icon: Icon, label, href, mini, active }) {
  return (
    <Link href={href} className={`yt-sidebar-item ${active ? 'active' : ''}`}>
      <span className="yt-sidebar-icon">
        <Icon style={{ fontSize: mini ? 24 : 20 }} />
      </span>
      <span>{label}</span>
    </Link>
  );
}

export default function Sidebar({ state, onOverlayClick }) {
  const router = useRouter();
  const active = (h) => router.pathname === h;
  const mini = state === 'mini';
  if (state === 'hidden') return null;

  return (
    <>
      {/* Mobile overlay */}
      {state === 'mobile-open' && (
        <div className="yt-sidebar-overlay show" onClick={onOverlayClick} />
      )}

      <aside className={`yt-sidebar ${state === 'expanded' || state === 'mobile-open' ? 'expanded' : 'mini'}`}>
        <div style={{ paddingTop: 8, paddingBottom: 16 }}>
          {MAIN.map((i) => (
            <SideItem key={i.href} {...i} mini={mini} active={active(i.href)} />
          ))}

          {!mini && (
            <>
              <div className="yt-sidebar-divider" />
              <div className="yt-sidebar-section">You</div>
              {YOU.map((i) => (
                <SideItem key={i.href} {...i} mini={false} active={active(i.href)} />
              ))}
              <div className="yt-sidebar-divider" />
              <div className="yt-sidebar-section">Explore</div>
              {EXPLORE.map((i) => (
                <SideItem key={i.href} {...i} mini={false} active={active(i.href)} />
              ))}
              <div className="yt-sidebar-divider" />
              <div style={{ padding: '8px 20px', fontSize: 12, color: '#717171', lineHeight: 2 }}>
                About Press Copyright<br />
                Contact us Creators<br />
                Advertise Developers<br />
                Terms Privacy
              </div>
              <div style={{ padding: '4px 20px 16px', fontSize: 12, color: '#717171' }}>
                © {dayjs().year()} Google LLC
              </div>
              <div style={{
                margin: '0 12px 16px', padding: '10px 12px',
                background: 'var(--yt-surface)', borderRadius: 10,
                fontSize: 12, color: '#aaa', textAlign: 'center',
              }}>
                Made with <span style={{ color: '#ff0000' }}>♥</span> by{' '}
                <strong style={{ color: '#f1f1f1' }}>Vaibhav More</strong>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
