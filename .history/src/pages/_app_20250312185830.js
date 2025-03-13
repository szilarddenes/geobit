import '@/styles/globals.css';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';

// Suppress useLayoutEffect warnings during SSR
if (typeof window === 'undefined') {
  // This is needed to prevent the warning during SSR
  React.useLayoutEffect = React.useEffect;
}

export default function App({ Component, pageProps }) {
  // Force CSS reloading
  useEffect(() => {
    // Add a brief delay to allow browser to load styles
    const timer = setTimeout(() => {
      const links = document.querySelectorAll('link[rel="stylesheet"]');
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
          const newHref = href.includes('?')
            ? `${href}&reload=${Date.now()}`
            : `${href}?reload=${Date.now()}`;
          link.setAttribute('href', newHref);
        }
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head>
        {/* Force CSS reload - add cache busting */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />

        {/* Use Inter font from Google Fonts since Square721 may not be loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

        {/* Fallback fonts */}
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;700&display=swap" rel="stylesheet" />

        {/* Default meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="GeoBit - TLDR newsletter for geoscientists with the latest research, industry news, and developments in earth sciences" />
      </Head>
      <Component {...pageProps} />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}