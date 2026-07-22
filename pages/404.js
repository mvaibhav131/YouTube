export default function Custom404() {
  return (
    <div style={{
      minHeight: '100vh', background: '#0f0f0f', color: '#f1f1f1',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Roboto, sans-serif', gap: 16,
    }}>
      <div style={{ fontSize: 72 }}>🎬</div>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>This page isn&apos;t available</h1>
      <p style={{ color: '#aaa', fontSize: 15 }}>The link may be broken or the page may have been removed.</p>
      <a href="/" style={{
        marginTop: 8, background: '#ff0000', color: '#fff',
        padding: '10px 24px', borderRadius: '20px', fontWeight: 700,
        fontSize: 14, textDecoration: 'none',
      }}>Go Home</a>
    </div>
  );
}
