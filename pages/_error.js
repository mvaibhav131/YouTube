// Custom _error.js with getInitialProps makes it dynamic (not statically pre-rendered),
// working around the Next.js 16 Turbopack bug where HtmlContext is missing during
// static generation of /_error: /404 and /500.

function Error({ statusCode }) {
  const title =
    statusCode === 404
      ? "This page isn't available"
      : statusCode === 500
      ? 'Something went wrong'
      : `Error ${statusCode}`;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0f0f0f',
        color: '#f1f1f1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Roboto, sans-serif',
        gap: 16,
      }}
    >
      <div style={{ fontSize: 64 }}>{statusCode === 404 ? '🎬' : '⚠️'}</div>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>{title}</h1>
      <a
        href="/"
        style={{
          marginTop: 8,
          background: '#ff0000',
          color: '#fff',
          padding: '10px 24px',
          borderRadius: '20px',
          fontWeight: 700,
          fontSize: 14,
          textDecoration: 'none',
        }}
      >
        Go Home
      </a>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
