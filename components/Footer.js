import dayjs from 'dayjs';

const YEAR = dayjs().year();

export default function Footer() {
  const links = [
    'About', 'Press', 'Copyright', 'Contact us', 'Creators',
    'Advertise', 'Developers', 'Terms', 'Privacy', 'Policy & Safety',
  ];

  return (
    <footer style={{
      padding: '24px 24px 32px',
      borderTop: '1px solid var(--yt-border)',
      marginTop: 40,
    }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px', marginBottom: 10 }}>
        {links.map((l) => (
          <a
            key={l}
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{ color: '#717171', fontSize: 13, textDecoration: 'none' }}
          >
            {l}
          </a>
        ))}
      </div>
      <div style={{ color: '#717171', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <span>© {YEAR} Google LLC</span>
        <span style={{ color: 'var(--yt-border)' }}>•</span>
        <span>
          Made with{' '}
          <span style={{ color: '#ff0000', fontSize: 14 }}>♥</span>{' '}
          by{' '}
          <strong style={{ color: '#f1f1f1', fontWeight: 700 }}>Vaibhav More</strong>
        </span>
      </div>
    </footer>
  );
}
