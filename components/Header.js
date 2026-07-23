import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  MenuOutlined, SearchOutlined, AudioOutlined, AudioMutedOutlined,
  VideoCameraAddOutlined, AppstoreOutlined, BellOutlined,
  UserOutlined, SunOutlined, MoonOutlined,
} from '@ant-design/icons';
import { useTheme } from '../lib/ThemeContext';

// Load mobile search overlay only on client
const MobileSearch = dynamic(() => import('./MobileSearch'), { ssr: false });

const YTPlayIcon = () => (
  <svg viewBox="0 0 28 20" width="28" height="20" fill="none">
    <path d="M27.97 3.12C27.64 1.89 26.68.93 25.45.6 23.22 0 14.28 0 14.28 0S5.35 0 3.12.6C1.89.93.93 1.89.6 3.12 0 5.35 0 10 0 10s0 4.65.6 6.88c.33 1.23 1.29 2.18 2.52 2.52C5.35 20 14.28 20 14.28 20s8.94 0 11.17-.6c1.23-.34 2.18-1.29 2.52-2.52C28.57 14.65 28.57 10 28.57 10s-.02-4.65-.6-6.88Z" fill="#FF0000" />
    <path d="M11.43 14.29 18.85 10l-7.42-4.29v8.58Z" fill="white" />
  </svg>
);

export default function Header({ onMenuClick }) {
  const { isDark, toggle } = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (router.query.q) setQuery(router.query.q);
  }, [router.query.q]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  // Desktop voice search using Web Speech API
  const handleVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Voice search not supported. Use Chrome or Edge.'); return; }
    const rec = new SR();
    rec.lang = 'en-IN';
    rec.continuous = false;
    rec.interimResults = false;
    setIsListening(true);
    rec.onresult = (e) => {
      const t = e.results[0][0].transcript;
      setIsListening(false);
      setQuery(t);
      router.push(`/search?q=${encodeURIComponent(t)}`);
    };
    rec.onerror = rec.onend = () => setIsListening(false);
    try { rec.start(); } catch { setIsListening(false); }
  };

  return (
    <>
      <header className="yt-header">
        {/* Left */}
        <button className="yt-icon-btn" onClick={onMenuClick} aria-label="Menu" style={{ fontSize: 20 }}>
          <MenuOutlined />
        </button>
        <Link href="/" className="yt-logo">
          <YTPlayIcon />
          <span className="yt-logo-text">YouTube</span>
          <span style={{ fontSize: 10, color: '#aaa', alignSelf: 'flex-end', marginBottom: 2 }}>IN</span>
        </Link>

        {/* Center — desktop search */}
        <div className="yt-search-wrap">
          <form className="yt-search-form" onSubmit={handleSearch}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search YouTube"
            />
            <button type="submit" className="yt-search-btn" aria-label="Search">
              <SearchOutlined style={{ fontSize: 18 }} />
            </button>
          </form>
          <button
            className={`yt-mic-btn${isListening ? ' voice-active' : ''}`}
            aria-label="Voice search"
            type="button"
            onClick={handleVoice}
            title="Search by voice"
          >
            {isListening
              ? <AudioMutedOutlined style={{ fontSize: 18, color: '#ff0000' }} />
              : <AudioOutlined style={{ fontSize: 18 }} />
            }
          </button>
        </div>

        {/* Right */}
        <div className="yt-header-right">
          {/* Mobile: search icon (opens overlay) */}
          <button
            className="yt-icon-btn show-mobile-only"
            onClick={() => setMobileSearchOpen(true)}
            aria-label="Search"
          >
            <SearchOutlined />
          </button>

          <button className="yt-icon-btn hide-mobile" aria-label="Create">
            <VideoCameraAddOutlined />
          </button>
          <button className="yt-icon-btn hide-mobile" aria-label="YouTube apps">
            <AppstoreOutlined />
          </button>
          <button
            className="yt-icon-btn hide-mobile"
            onClick={toggle}
            aria-label="Toggle theme"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <SunOutlined /> : <MoonOutlined />}
          </button>
          {/* Theme toggle — visible on mobile too */}
          <button
            className="yt-icon-btn show-mobile-only"
            onClick={toggle}
            aria-label="Toggle theme"
          >
            {isDark ? <SunOutlined /> : <MoonOutlined />}
          </button>
          <button className="yt-icon-btn" aria-label="Notifications" style={{ position: 'relative' }}>
            <BellOutlined />
            <span className="yt-notif-dot" />
          </button>
          <Link href="/login">
            <div className="yt-avatar" role="button" aria-label="Account">
              <UserOutlined style={{ fontSize: 18 }} />
            </div>
          </Link>
        </div>
      </header>

      {/* Mobile full-screen search overlay */}
      {mobileSearchOpen && (
        <MobileSearch onClose={() => setMobileSearchOpen(false)} />
      )}
    </>
  );
}
