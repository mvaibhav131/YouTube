import { ConfigProvider, App as AntApp, theme } from 'antd';
import Head from 'next/head';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            colorPrimary:      '#ff0000',
            fontFamily:        "'Roboto', sans-serif",
            colorBgBase:       '#0f0f0f',
            colorBgContainer:  '#212121',
            colorBgElevated:   '#2f2f2f',
            colorText:         '#f1f1f1',
            colorTextSecondary:'#aaaaaa',
            borderRadius:      8,
          },
        }}
      >
        <AntApp>
          <Component {...pageProps} />
        </AntApp>
      </ConfigProvider>
    </>
  );
}
