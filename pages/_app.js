import { useState, useEffect } from 'react';
import { ConfigProvider, App as AntApp, theme } from 'antd';
import Head from 'next/head';
import { ThemeCtx } from '../lib/ThemeContext';
import { StoreProvider } from '../lib/store';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  const [isDark, setIsDark] = useState(false); // default: light

  // Read saved preference on first load
  useEffect(() => {
    const saved = localStorage.getItem('yt-theme');
    if (saved === 'light') {
      setIsDark(false);
      document.documentElement.classList.add('light');
    }
  }, []);

  const toggle = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.remove('light');
        localStorage.setItem('yt-theme', 'dark');
      } else {
        document.documentElement.classList.add('light');
        localStorage.setItem('yt-theme', 'light');
      }
      return next;
    });
  };

  const darkTokens = {
    colorBgBase:        '#0f0f0f',
    colorBgContainer:   '#212121',
    colorBgElevated:    '#2f2f2f',
    colorText:          '#f1f1f1',
    colorTextSecondary: '#aaaaaa',
  };

  const lightTokens = {
    colorBgBase:        '#ffffff',
    colorBgContainer:   '#f2f2f2',
    colorBgElevated:    '#e5e5e5',
    colorText:          '#0f0f0f',
    colorTextSecondary: '#606060',
  };

  return (
    <StoreProvider>
      <ThemeCtx.Provider value={{ isDark, toggle }}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ConfigProvider
        theme={{
          algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            colorPrimary: '#ff0000',
            fontFamily:   "'Roboto', sans-serif",
            borderRadius: 8,
            ...(isDark ? darkTokens : lightTokens),
          },
        }}
      >
        <AntApp>
          <Component {...pageProps} />
        </AntApp>
      </ConfigProvider>
      </ThemeCtx.Provider>
    </StoreProvider>
  );
}
