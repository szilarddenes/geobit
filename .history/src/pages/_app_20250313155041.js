import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';

// Suppress React warnings in development
if (process.env.NODE_ENV !== 'production') {
  const originalConsoleError = console.error;

  console.error = (...args) => {
    // Don't log the fetchPriority warning
    const suppressedWarnings = [
      'Warning: React does not recognize the `fetchPriority` prop',
    ];

    if (typeof args[0] === 'string' && suppressedWarnings.some(warning => args[0].includes(warning))) {
      return;
    }

    originalConsoleError(...args);
  };
}

export default function App({ Component, pageProps }) {
  // Re-enable original console.error on unmount for cleanup
  useEffect(() => {
    return () => {
      if (process.env.NODE_ENV !== 'production' && window.originalConsoleError) {
        console.error = window.originalConsoleError;
      }
    };
  }, []);

  return (
    <>
      <Component {...pageProps} />
      <ToastContainer position="bottom-right" />
    </>
  );
}