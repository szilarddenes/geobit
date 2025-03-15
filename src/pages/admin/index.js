import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiCalendar, FiFileText, FiSettings, FiPlusCircle, FiBarChart } from 'react-icons/fi';
import Head from 'next/head';
import { useAuth } from '@/lib/firebase/auth';
import { cn } from '@/lib/utils';
import { FcGoogle } from 'react-icons/fc';
import {
  FiLock,
  FiLogOut,
  FiUsers,
  FiRss,
  FiSettings as FiSettingsIcon,
  FiBarChart2,
  FiEdit,
  FiArchive,
  FiRefreshCw,
  FiSearch,
  FiCpu,
  FiAlertTriangle
} from 'react-icons/fi';
import LoadingState from '@/components/LoadingState';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  generateNewsletterOnDemand,
  verifyAdminTokenLocally,
  getApiStatus
} from '@/lib/firebase';
import ApiStatusIndicator from '@/components/admin/ApiStatusIndicator';
import { processArticleContent, searchGeoscienceNews } from '@/lib/api';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { getFirebaseApp } from '../../lib/firebase';

// Admin layout
const AdminLayout = ({ children, title }) => {
  const { user, logout } = useAuth();

  return (
    <>
      <Head>
        <title>{`${title ? `${title} - ` : ''}GeoBit Admin`}</title>
        <meta name="description" content="GeoBit Administration" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-dark">
        <nav className="bg-dark-lighter shadow-dark-sm py-4">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-primary">GeoBit Admin</h1>
            {user && (
              <div className="flex items-center space-x-4">
                <div className="text-sm hidden md:block text-light-muted">
                  {user.email}
                </div>
                <button
                  onClick={logout}
                  className="bg-dark-light text-primary px-3 py-1 rounded text-sm hover:bg-dark-card transition-colors flex items-center border border-dark-border"
                >
                  <FiLogOut className="mr-1" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8">
          {title && <h1 className="text-2xl font-bold mb-6 text-primary">{title}</h1>}
          {children}
        </div>
      </div>
    </>
  );
};

// Login form component
const LoginForm = () => {
  const { loginWithEmail, loginWithGoogle, authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if already logged in
    const adminToken = localStorage.getItem('geobit_admin_token');
    if (adminToken) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  // If there's a Firebase auth error from context, display it
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Sign in with Firebase Authentication
      const user = await loginWithEmail(email, password);

      // Get ID token
      const idToken = await user.getIdToken();

      // Verify admin status - In development mode, we'll just use local verification
      const isAdmin = process.env.NODE_ENV === 'development'
        ? await verifyAdminLocally(idToken, user.email)
        : await verifyAdminWithAPI(idToken);

      if (isAdmin) {
        // Save token to localStorage for subsequent requests
        localStorage.setItem('geobit_admin_token', idToken);

        // Redirect to admin dashboard
        router.push('/admin/dashboard');
      } else {
        throw new Error('You do not have admin privileges');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to log in');
      setIsLoading(false);
    }
  };

  // Local admin verification for development mode
  const verifyAdminLocally = async (token, email) => {
    // In development, we'll consider the test account as admin
    if (email === 'test@test.test') {
      return true;
    }

    // For other development accounts, simulate an API check
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(email.endsWith('@geobit.tech'));
      }, 500);
    });
  };

  // API verification for production
  const verifyAdminWithAPI = async (token) => {
    try {
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Admin verification failed');
      }

      const data = await response.json();
      return data.isAdmin;
    } catch (err) {
      console.error('Admin verification error:', err);
      throw err;
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Use redirect for mobile, popup for desktop
      const isMobile = window.innerWidth < 768;
      await loginWithGoogle(isMobile);
    } catch (err) {
      setError(err.message || 'Google login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark">
      <Head>
        <title>Admin Login - GeoBit</title>
        <meta name="description" content="GeoBit Admin Login" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-full max-w-md p-8 bg-dark-lighter rounded-lg shadow-lg border border-dark-border">
        <div className="flex flex-col items-center mb-6">
          <img
            src="/logo3.svg"
            alt="GeoBit Logo"
            width={220}
            height={60}
            className="h-14 w-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-light">Admin Login</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 rounded-md text-red-500 flex items-center">
            <FiAlertTriangle className="mr-2 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-light font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded bg-dark border border-dark-border text-light focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-light font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 rounded bg-dark border border-dark-border text-light focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/80 text-dark font-bold py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-primary transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-dark rounded-full"></span>
                  Signing In...
                </span>
              ) : (
                <span className="flex items-center">
                  <FiLock className="mr-2" />
                  Sign In
                </span>
              )}
            </button>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <div className="text-center text-light-muted text-sm mt-4">
              <p className="mb-1">For development/testing:</p>
              <p>Email: test@test.test</p>
              <p>Password: testtest</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

// Enhanced Dashboard component
const EnhancedDashboard = () => {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessingContent, setIsProcessingContent] = useState(false);
  const [isSearchingNews, setIsSearchingNews] = useState(false);
  const [apiStatus, setApiStatus] = useState({
    openRouter: { status: 'unknown', message: 'Checking status...' },
    firebase: { status: 'unknown', message: 'Checking status...' },
    email: { status: 'unknown', message: 'Checking status...' }
  });
  const [isRefreshingStatus, setIsRefreshingStatus] = useState(false);

  useEffect(() => {
    // We already authenticated to reach this component, so we don't need to redirect
    // Just check the API status
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    setIsRefreshingStatus(true);
    try {
      const adminToken = localStorage.getItem('geobit_admin_token');

      // Try to use Firebase function to get API status
      try {
        const result = await getApiStatus({ token: adminToken });

        if (result.data.success) {
          setApiStatus(result.data.status);
        } else {
          throw new Error(result.data.error || 'Failed to fetch API status');
        }
      } catch (error) {
        console.warn('Firebase function error, using development status:', error);

        // Development fallback
        if (verifyAdminTokenLocally(adminToken)) {
          // Simulate API status in development
          setApiStatus({
            openRouter: {
              status: 'ok',
              message: 'Development mode - API simulated',
              quota: { used: 25, limit: 100, remaining: 75 }
            },
            firebase: {
              status: 'ok',
              message: 'Development mode - Firebase simulated',
              usage: { reads: 120, writes: 45, deletes: 10 }
            },
            email: {
              status: 'ok',
              message: 'Development mode - Email service simulated',
              quota: { used: 250, limit: 2000, remaining: 1750 }
            }
          });
        }
      }
    } catch (error) {
      console.error('Error checking API status:', error);
      toast.error('Failed to check API status');
    } finally {
      setIsRefreshingStatus(false);
    }
  };

  const handleGenerateNewsletter = async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    toast.info('Generating newsletter...');

    try {
      const adminToken = localStorage.getItem('geobit_admin_token');

      if (!adminToken) {
        toast.error('You must be logged in as an admin');
        return;
      }

      // Try to use Firebase function
      try {
        const result = await generateNewsletterOnDemand({
          token: adminToken
        });

        if (result.data.success) {
          toast.success('Newsletter generated successfully!');
          router.push(`/admin/newsletters/edit/${result.data.newsletterId}`);
        } else {
          throw new Error(result.data.error || 'Failed to generate newsletter');
        }
      } catch (error) {
        console.warn('Firebase function error, using development fallback:', error);

        // Development fallback if using dev token
        if (verifyAdminTokenLocally(adminToken)) {
          // Show success message but stay on dashboard (no real newsletter in dev mode)
          toast.success('Development mode: Newsletter generation simulated');
          toast.info('Firebase Functions must be deployed for full functionality');
        } else {
          // Pass through error for non-dev tokens
          throw error;
        }
      }
    } catch (error) {
      console.error('Error generating newsletter:', error);
      toast.error(error.message || 'Failed to generate newsletter');
    } finally {
      setIsGenerating(false);
    }
  };

  // Process article content with AI
  const handleProcessContent = () => {
    router.push('/admin/content/process');
  };

  // Search for geoscience news
  const handleSearchNews = async () => {
    if (isSearchingNews) return;

    // In a real implementation, you'd show a form with advanced search options
    // For simplicity in this example, we'll use a prompt
    const keywords = prompt('Enter keywords to search for geoscience news:');
    if (!keywords) return;

    setIsSearchingNews(true);
    toast.info('Searching for geoscience news...');

    try {
      const result = await searchGeoscienceNews({
        keywords,
        dateRange: {}, // Empty object for no date restrictions
        sources: [],   // Empty array for no source restrictions
        page: 1,
        limit: 10
      });

      if (result.success) {
        toast.success(`Found ${result.pagination.total} results!`);

        // Navigate to a search results page
        router.push({
          pathname: '/admin/content/search',
          query: {
            searchId: result.searchId,
            query: result.query
          }
        });
      } else {
        throw new Error(result.error || 'Failed to search for news');
      }
    } catch (error) {
      console.error('Error searching for news:', error);
      toast.error(error.message || 'Failed to search for geoscience news');
    } finally {
      setIsSearchingNews(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">
          Dashboard
        </h1>
        <button
          onClick={checkApiStatus}
          disabled={isRefreshingStatus}
          className="flex items-center gap-2 text-sm bg-dark-light text-primary font-medium py-1 px-3 rounded-md transition border border-dark-border"
        >
          <FiRefreshCw className={`${isRefreshingStatus ? 'animate-spin' : ''}`} />
          {isRefreshingStatus ? 'Refreshing...' : 'Refresh Status'}
        </button>
      </div>

      {/* API Status */}
      <div className="bg-dark-card p-6 rounded-lg shadow-dark-md mb-8 border border-dark-border">
        <h2 className="text-xl font-bold text-primary mb-4 flex items-center">
          <FiSettingsIcon className="mr-2" /> System Status
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <ApiStatusIndicator
            title="AI API"
            status={apiStatus.openRouter.status}
            message={apiStatus.openRouter.message}
            details={apiStatus.openRouter.quota}
          />
          <ApiStatusIndicator
            title="Firebase"
            status={apiStatus.firebase.status}
            message={apiStatus.firebase.message}
            details={apiStatus.firebase.usage}
          />
          <ApiStatusIndicator
            title="Email Service"
            status={apiStatus.email.status}
            message={apiStatus.email.message}
            details={apiStatus.email.quota}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-dark-card p-6 rounded-lg shadow-dark-md border border-dark-border">
          <h2 className="text-xl font-bold text-primary mb-4 flex items-center">
            <FiEdit className="mr-2" /> Content Management
          </h2>
          <div className="space-y-4">
            <div className="border-b border-dark-border pb-4">
              <h3 className="font-medium text-light mb-2">Newsletter Generation</h3>
              <p className="text-light-muted mb-4 text-sm">
                Generate a new newsletter with AI-powered summaries of the latest geoscience content.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleGenerateNewsletter}
                  disabled={isGenerating}
                  className="bg-blue-600 hover:bg-blue-700 text-dark font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
                >
                  {isGenerating ? 'Generating...' : 'Generate New Newsletter'}
                </button>
              </div>
            </div>

            {/* New AI Functions Section */}
            <div className="border-b border-dark-border pb-4">
              <h3 className="font-medium text-light mb-2">AI Content Processing</h3>
              <p className="text-light-muted mb-4 text-sm">
                Process article content with AI to generate summaries, categorize content, and rate interest level.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleProcessContent}
                  disabled={isProcessingContent}
                  className="bg-purple-600 hover:bg-purple-700 text-dark font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 flex items-center"
                >
                  <FiCpu className="mr-2" />
                  {isProcessingContent ? 'Processing...' : 'Process Article Content'}
                </button>
              </div>
            </div>

            <div className="border-b border-dark-border pb-4">
              <h3 className="font-medium text-light mb-2">Geoscience News Search</h3>
              <p className="text-light-muted mb-4 text-sm">
                Search for the latest geoscience news and research papers using AI-powered search.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleSearchNews}
                  disabled={isSearchingNews}
                  className="bg-green-600 hover:bg-green-700 text-dark font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 flex items-center"
                >
                  <FiSearch className="mr-2" />
                  {isSearchingNews ? 'Searching...' : 'Search Geoscience News'}
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-light mb-2">Content Collection</h3>
              <p className="text-light-muted mb-4 text-sm">
                Search for new content or manage your content sources.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/admin/content/collect"
                  className="bg-amber-600 hover:bg-amber-700 text-dark font-medium py-2 px-4 rounded-md transition duration-200 inline-block"
                >
                  Collect New Content
                </Link>
                <Link
                  href="/admin/sources"
                  className="bg-green-600 hover:bg-green-700 text-dark font-medium py-2 px-4 rounded-md transition duration-200 inline-block"
                >
                  Manage Sources
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-dark-card p-6 rounded-lg shadow-dark-md border border-dark-border">
          <h2 className="text-xl font-bold text-primary mb-4 flex items-center">
            <FiBarChart2 className="mr-2" /> Analytics & Monitoring
          </h2>

          <div className="space-y-4">
            <div className="border-b border-dark-border pb-4">
              <h3 className="font-medium text-light mb-2">Key Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-dark-light p-3 rounded-md">
                  <p className="text-light-muted text-xs mb-1">Subscribers</p>
                  <p className="text-2xl font-bold text-primary">247</p>
                </div>
                <div className="bg-dark-light p-3 rounded-md">
                  <p className="text-light-muted text-xs mb-1">Open Rate</p>
                  <p className="text-2xl font-bold text-primary">38.2%</p>
                </div>
                <div className="bg-dark-light p-3 rounded-md">
                  <p className="text-light-muted text-xs mb-1">Newsletters</p>
                  <p className="text-2xl font-bold text-primary">12</p>
                </div>
                <div className="bg-dark-light p-3 rounded-md">
                  <p className="text-light-muted text-xs mb-1">Articles</p>
                  <p className="text-2xl font-bold text-primary">148</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-light mb-2">Tools & Reports</h3>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/admin/analytics"
                  className="bg-amber-600 hover:bg-amber-700 text-dark font-medium py-2 px-4 rounded-md transition duration-200 inline-block"
                >
                  View Analytics
                </Link>
                <Link
                  href="/admin/logs"
                  className="bg-slate-600 hover:bg-slate-700 text-dark font-medium py-2 px-4 rounded-md transition duration-200 inline-block"
                >
                  System Logs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-dark-card p-6 rounded-lg shadow-dark-md border border-dark-border">
          <h2 className="text-xl font-bold text-primary mb-4 flex items-center">
            <FiUsers className="mr-2" /> Audience
          </h2>
          <div className="space-y-4">
            <div className="border-b border-dark-border pb-4">
              <h3 className="font-medium text-light mb-2">Subscriber Management</h3>
              <p className="text-light-muted mb-4 text-sm">
                View and manage your newsletter subscribers.
              </p>
              <Link
                href="/admin/subscribers"
                className="bg-blue-600 hover:bg-blue-700 text-dark font-medium py-2 px-4 rounded-md transition duration-200 inline-block"
              >
                Manage Subscribers
              </Link>
            </div>

            <div>
              <h3 className="font-medium text-light mb-2">Recent Signups</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm p-2 bg-dark-light rounded">
                  <span className="text-light">john.doe@example.com</span>
                  <span className="text-light-muted text-xs">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between text-sm p-2 bg-dark-light rounded">
                  <span className="text-light">jane.smith@university.edu</span>
                  <span className="text-light-muted text-xs">5 hours ago</span>
                </div>
                <div className="flex items-center justify-between text-sm p-2 bg-dark-light rounded">
                  <span className="text-light">researcher@geo.org</span>
                  <span className="text-light-muted text-xs">yesterday</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-dark-card p-6 rounded-lg shadow-dark-md border border-dark-border">
          <h2 className="text-xl font-bold text-primary mb-4 flex items-center">
            <FiArchive className="mr-2" /> Archives & Publishing
          </h2>
          <div className="space-y-4">
            <div className="border-b border-dark-border pb-4">
              <h3 className="font-medium text-light mb-2">Newsletter Archives</h3>
              <p className="text-light-muted mb-4 text-sm">
                View and edit past newsletters.
              </p>
              <Link
                href="/admin/newsletters"
                className="bg-green-600 hover:bg-green-700 text-dark font-medium py-2 px-4 rounded-md transition duration-200 inline-block"
              >
                View Archives
              </Link>
            </div>

            <div>
              <h3 className="font-medium text-light mb-2">Latest Newsletters</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm p-2 bg-dark-light rounded">
                  <span className="text-light">Weekly Roundup - March 13, 2025</span>
                  <span className="bg-green-100 text-green-800 text-xs py-1 px-2 rounded-full">Published</span>
                </div>
                <div className="flex items-center justify-between text-sm p-2 bg-dark-light rounded">
                  <span className="text-light">Research Highlights - March 10, 2025</span>
                  <span className="bg-green-100 text-green-800 text-xs py-1 px-2 rounded-full">Published</span>
                </div>
                <div className="flex items-center justify-between text-sm p-2 bg-dark-light rounded">
                  <span className="text-light">Weekly Roundup - March 6, 2025</span>
                  <span className="bg-green-100 text-green-800 text-xs py-1 px-2 rounded-full">Published</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Page Component
export default function AdminPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <AdminLayout>
        <LoadingState message="Checking authentication..." />
      </AdminLayout>
    );
  }

  // Check for admin token in localStorage as a fallback
  const hasAdminToken = typeof window !== 'undefined' && localStorage.getItem('geobit_admin_token');

  if (!user && !hasAdminToken) {
    // User is not logged in, show login form
    return (
      <AdminLayout title="Admin Login">
        <LoginForm />
      </AdminLayout>
    );
  }

  // User is logged in, show dashboard
  return (
    <AdminLayout title="Admin Dashboard">
      <EnhancedDashboard />
    </AdminLayout>
  );
}
