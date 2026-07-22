import { UserOutlined } from '@ant-design/icons';

export default function AuthWall({ section, description }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', gap: 16, padding: 24,
      color: 'var(--yt-text)',
    }}>
      <div style={{
        width: 96, height: 96, borderRadius: '50%',
        background: 'var(--yt-surface)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <UserOutlined style={{ fontSize: 48, color: '#aaa' }} />
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 600 }}>Enjoy your {section}</h2>
      <p style={{ color: '#aaa', fontSize: 15, textAlign: 'center', maxWidth: 380, lineHeight: 1.6 }}>
        {description || `Sign in to see your ${section.toLowerCase()} and other personalised info.`}
      </p>
      <button style={{
        background: 'transparent',
        border: '1px solid var(--yt-blue)',
        color: 'var(--yt-blue)',
        padding: '10px 22px', borderRadius: 20,
        cursor: 'pointer', fontSize: 14, fontWeight: 600,
        display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: 'inherit',
      }}>
        <UserOutlined /> Sign in
      </button>
    </div>
  );
}
