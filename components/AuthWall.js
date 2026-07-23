import Link from 'next/link';
import { UserOutlined, CloseOutlined, CheckCircleFilled } from '@ant-design/icons';
import { useStore } from '../lib/store';

export default function AuthWall({ section, description }) {
  const { user } = useStore();

  // If user is logged in — show a "coming soon" instead of auth wall
  if (user) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: '60vh', gap: 16, padding: 24,
        color: 'var(--yt-text)',
      }}>
        <CheckCircleFilled style={{ fontSize: 56, color: '#4caf50' }} />
        <h2 style={{ fontSize: 20, fontWeight: 600 }}>Signed in as {user.name}</h2>
        <p style={{ color: 'var(--yt-text-2)', fontSize: 15, textAlign: 'center', maxWidth: 380 }}>
          {section} will be available in a future update.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', gap: 16, padding: 24,
      color: 'var(--yt-text)', position: 'relative',
    }}>
      {/* ✕ Close button — top right */}
      <button
        onClick={() => {
          if (typeof window !== 'undefined') window.history.back();
        }}
        title="Close"
        style={{
          position: 'absolute', top: 0, right: 24,
          background: 'var(--yt-surface)', border: 'none',
          borderRadius: '50%', width: 40, height: 40,
          cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: 'var(--yt-text)',
          fontSize: 16,
        }}
      >
        <CloseOutlined />
      </button>

      <div style={{
        width: 96, height: 96, borderRadius: '50%',
        background: 'var(--yt-surface)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginTop: 16,
      }}>
        <UserOutlined style={{ fontSize: 48, color: '#aaa' }} />
      </div>

      <h2 style={{ fontSize: 20, fontWeight: 600 }}>Enjoy your {section}</h2>
      <p style={{ color: '#aaa', fontSize: 15, textAlign: 'center', maxWidth: 380, lineHeight: 1.6 }}>
        {description || `Sign in to see your ${section.toLowerCase()} and other personalised info.`}
      </p>

      <Link href="/login" style={{ textDecoration: 'none' }}>
        <span style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'transparent',
          border: '1px solid var(--yt-blue)',
          color: 'var(--yt-blue)',
          padding: '10px 22px', borderRadius: 20,
          cursor: 'pointer', fontSize: 14, fontWeight: 600,
        }}>
          <UserOutlined /> Sign in
        </span>
      </Link>

      <p style={{ fontSize: 13, color: 'var(--yt-text-2)', marginTop: 4 }}>
        Don&apos;t have an account?{' '}
        <Link href="/signup" style={{ color: 'var(--yt-blue)', textDecoration: 'none' }}>
          Create one
        </Link>
      </p>
    </div>
  );
}

