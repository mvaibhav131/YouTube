/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Turbopack is the default bundler in Next.js 16 — no extra config needed.
  // transpilePackages ensures antd's ESM builds are bundled properly.
  transpilePackages: [
    'antd',
    'rc-util',
    'rc-picker',
    'rc-pagination',
    'rc-input',
    'rc-select',
    'rc-tree',
    'rc-table',
    'rc-tabs',
    'rc-menu',
    '@ant-design/icons',
    '@ant-design/cssinjs',
  ],

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'yt3.ggpht.com' },
      { protocol: 'https', hostname: 'yt3.googleusercontent.com' },
    ],
    // Next.js 16 default: minimumCacheTTL is now 4 hours (14400s)
    minimumCacheTTL: 14400,
  },
};

module.exports = nextConfig;
