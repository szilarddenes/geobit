import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import { AuthProvider } from '@/lib/firebase/auth';
import ErrorBoundary from '@/components/ErrorBoundary';

// Store original functions
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  window.originalConsoleError = console.error;

  // Replace console.error
  console.error = (...args) => {
    // Comprehensive list of warnings to suppress
    const suppressedWarnings = [
      'Warning: React does not recognize the `fetchPriority` prop',
      'fetchPriority',
      'fetchpriority',
      'Firebase: Error (auth/invalid-api-key)', // Suppress during development
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

  // Use getLayout pattern if available
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <ErrorBoundary>
      <AuthProvider>
        {getLayout(<Component {...pageProps} />)}
        <ToastContainer position="bottom-right" theme="dark" />
      </AuthProvider>
    </ErrorBoundary>
  );
}