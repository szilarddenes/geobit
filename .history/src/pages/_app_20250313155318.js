import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';

// Store original functions
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  window.originalConsoleError = console.error;

  // Replace console.error
  console.error = (...args) => {
    // Comprehensive list of warnings to suppress
    const suppressedWarnings = [
      'Warning: React does not recognize the `fetchPriority` prop',
      'fetchPriority',
      'fetchpriority'
    ];

    // Check if any argument contains our suppressed warning text
    if (args.some(arg =>
      typeof arg === 'string' &&
      suppressedWarnings.some(warning => arg.includes(warning))
    )) {
      return; // Don't log this warning
    }

    // Call original with any other errors
    window.originalConsoleError(...args);
  };
}

export default function App({ Component, pageProps }) {
  // Re-enable original console.error on unmount for cleanup
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' &&
        process.env.NODE_ENV !== 'production' &&
        window.originalConsoleError) {
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