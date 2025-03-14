import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiCalendar, FiFileText, FiSettings, FiPlusCircle, FiBarChart } from 'react-icons/fi';
import Head from 'next/head';
import { useAuth } from '@/lib/firebase/auth';
import { cn } from '@/lib/utils';
import { FcGoogle } from 'react-icons/fc';
import { FiLock, FiLogOut, FiUsers } from 'react-icons/fi';
import LoadingState from '@/components/LoadingState';

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

  // If there's a Firebase auth error from context, display it
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await loginWithEmail(email, password);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
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
    <div className="max-w-md mx-auto bg-dark-card rounded-lg shadow-dark-md p-8 border border-dark-border">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-primary">Admin Login</h2>
        <p className="text-light-muted mt-1">Sign in to access the admin dashboard</p>
      </div>

      {error && (
        <div className="mb-4 bg-dark-light text-red-400 p-3 rounded border border-red-800 text-sm">
          {error.includes('Firebase') ? 'Authentication service error. Please try again later.' : error}
        </div>
      )}

      {/* Google Login Button - Highlighted */}
      <div className="mb-6 border-2 border-primary p-1 rounded-lg">
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className={cn(
            "w-full flex items-center justify-center py-3 px-4 rounded-md bg-white shadow-dark-sm",
            "text-gray-700 font-medium border border-gray-200 hover:bg-gray-50 transition-colors",
            isLoading && "opacity-70 cursor-not-allowed"
          )}
        >
          <FcGoogle className="w-6 h-6 mr-2" />
          <span>Sign in with Google</span>
        </button>
      </div>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-dark-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-dark-card text-light-muted">Or continue with email</span>
        </div>
      </div>

      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-light mb-1">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="h-5 w-5 text-light-muted" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-dark-border rounded-md shadow-dark-sm bg-dark-light text-light focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="admin@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-light mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="h-5 w-5 text-light-muted" />
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-dark-border rounded-md shadow-dark-sm bg-dark-light text-light focus:ring-primary focus:border-primary sm:text-sm"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-dark-sm text-sm font-medium text-dark bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
            isLoading && "opacity-70 cursor-not-allowed"
          )}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-light-muted">Access restricted to authorized administrators only</p>
      </div>

      {/* Session Troubleshooting Section */}
      <div className="mt-8 pt-6 border-t border-dark-border">
        <div className="text-center">
          <h3 className="text-sm font-medium text-light-muted mb-2">Having trouble signing in?</h3>
          <button
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              window.location.reload();
            }}
            className="text-xs bg-dark-light text-primary px-3 py-1 rounded hover:bg-dark-lighter transition-colors inline-flex items-center border border-dark-border"
          >
            <FiLogOut className="mr-1" />
            <span>Clear Session & Reload</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Dashboard component
const Dashboard = () => {
  // Sample dashboard data
  const stats = [
    { label: 'Total Subscribers', value: '5,234', icon: <FiUser className="text-primary" /> },
    { label: 'Newsletters Sent', value: '137', icon: <FiMail className="text-primary" /> },
    { label: 'Articles Published', value: '428', icon: <FiFileText className="text-primary" /> },
    { label: 'Avg. Open Rate', value: '42.8%', icon: <FiBarChart className="text-primary" /> }
  ];

  // Recent subscribers
  const recentSubscribers = [
    { id: 1, email: 'john.doe@example.com', date: 'Mar 12, 2025' },
    { id: 2, email: 'jane.smith@organization.org', date: 'Mar 12, 2025' },
    { id: 3, email: 'alex@research.edu', date: 'Mar 11, 2025' },
    { id: 4, email: 'research@geology.com', date: 'Mar 11, 2025' },
    { id: 5, email: 'scientist123@institute.org', date: 'Mar 10, 2025' }
  ];

  // Upcoming newsletters
  const upcomingNewsletters = [
    { id: 1, title: 'Daily Update - March 13, 2025', status: 'Draft', date: 'Mar 13, 2025' },
    { id: 2, title: 'Weekly Roundup - March 14, 2025', status: 'Scheduled', date: 'Mar 14, 2025' }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-dark-card p-6 rounded-lg shadow-dark-md flex items-start gap-4 border border-dark-border">
            <div className="p-3 bg-dark-light rounded-full">
              {stat.icon}
            </div>
            <div>
              <p className="text-light-muted text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-dark-card p-6 rounded-lg shadow-dark-md border border-dark-border">
        <h2 className="text-lg font-bold mb-4 text-primary">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button className="flex items-center bg-primary text-dark px-4 py-2 rounded-md hover:bg-primary-light">
            <FiPlusCircle className="mr-2" />
            New Newsletter
          </button>
          <button className="flex items-center bg-dark-light text-light px-4 py-2 rounded-md hover:bg-dark-lighter border border-dark-border">
            <FiFileText className="mr-2" />
            Add Article
          </button>
          <button className="flex items-center bg-dark-light text-light px-4 py-2 rounded-md hover:bg-dark-lighter border border-dark-border">
            <FiMail className="mr-2" />
            Manage Subscribers
          </button>
          <button className="flex items-center bg-dark-light text-light px-4 py-2 rounded-md hover:bg-dark-lighter border border-dark-border">
            <FiSettings className="mr-2" />
            Settings
          </button>
        </div>
      </div>

      {/* Main Content will continue... */}
    </div>
  );
};

// Main Admin Page Component
const AdminPage = () => {
  const { user, loading, isAdmin } = useAuth();

  // If loading, show loading state
  if (loading) {
    return (
      <AdminLayout title="Loading">
        <LoadingState message="Authenticating..." />
      </AdminLayout>
    );
  }

  // If not logged in, show login form
  if (!user) {
    return (
      <AdminLayout title="Login">
        <LoginForm />
      </AdminLayout>
    );
  }

  // If logged in but not admin, show access denied
  if (!isAdmin) {
    return (
      <AdminLayout title="Access Denied">
        <div className="bg-dark-card p-8 rounded-lg shadow-dark-md text-center border border-dark-border">
          <h2 className="text-xl font-bold text-red-400 mb-3">Access Denied</h2>
          <p className="text-light-muted mb-6">
            Your account does not have administrator privileges. Please contact an administrator for assistance.
          </p>
          <button
            onClick={() => localStorage.clear() || sessionStorage.clear() || window.location.reload()}
            className="bg-dark-light text-primary px-4 py-2 rounded text-sm hover:bg-dark-lighter transition-colors flex items-center mx-auto border border-dark-border"
          >
            <FiLogOut className="mr-2" />
            <span>Logout</span>
          </button>
        </div>
      </AdminLayout>
    );
  }

  // If admin, show dashboard
  return (
    <AdminLayout title="Dashboard">
      <Dashboard />
    </AdminLayout>
  );
};

export default AdminPage;
