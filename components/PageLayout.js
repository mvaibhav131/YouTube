import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

/**
 * Shared layout: Header + Sidebar + <main> + Footer.
 * All pages use this — no duplicated sidebar state logic.
 */
export default function PageLayout({
  title,
  children,
  defaultSidebar = 'expanded', // 'expanded' | 'mini' | 'hidden'
  showFooter = true,
}) {
  const [sidebar, setSidebar] = useState(defaultSidebar);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setIsMobile(w < 700);
      if (w < 700)        setSidebar('hidden');
      else if (w < 1100)  setSidebar(defaultSidebar === 'hidden' ? 'hidden' : 'mini');
      else                setSidebar(defaultSidebar);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [defaultSidebar]);

  const toggleMenu = () => {
    if (isMobile) setSidebar((s) => (s === 'hidden' ? 'mobile-open' : 'hidden'));
    else          setSidebar((s) => (s === 'expanded' ? 'mini' : 'expanded'));
  };

  const sidebarClass =
    sidebar === 'expanded'    ? 'sidebar-expanded' :
    sidebar === 'mini'        ? 'sidebar-mini'     : '';

  return (
    <>
      {title && <Head><title>{title}</title></Head>}
      <Header onMenuClick={toggleMenu} />
      <Sidebar state={sidebar} onOverlayClick={() => setSidebar('hidden')} />
      <main className={`yt-main ${sidebarClass}`}>
        {children}
        {showFooter && <Footer />}
      </main>
    </>
  );
}
