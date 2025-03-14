import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiCalendar, FiFileText, FiSettings, FiPlusCircle, FiBarChart } from 'react-icons/fi';
import Head from 'next/head';
import { adminLogin } from '@/lib/firebase';
import { useAuth } from '@/lib/firebase/auth';
import { cn } from '@/lib/utils';
import { FcGoogle } from 'react-icons/fc';
import { FiLock, FiLogOut, FiUsers } from 'react-icons/fi';

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
  const { loginWithEmail, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
          {error}
        </div>
      )}

      {/* Google Login Button - Highlighted */}
      <div className="mb-6 border-2 border-primary p-1 rounded-lg">
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className={cn(
            "w-full flex items-center justify-center py-3 px-4 rounded-md bg-dark-light shadow-dark-sm",
            "text-light font-medium border border-dark-border hover:bg-dark-lighter transition-colors",
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

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Subscribers */}
        <div className="bg-dark-card p-6 rounded-lg shadow-dark-md border border-dark-border">
          <h2 className="text-lg font-bold mb-4 text-primary">Recent Subscribers</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="py-2 text-left text-sm font-medium text-light-muted">Email</th>
                  <th className="py-2 text-left text-sm font-medium text-light-muted">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="border-b border-dark-border">
                    <td className="py-3 text-light">{subscriber.email}</td>
                    <td className="py-3 text-light-muted">{subscriber.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right">
            <a href="#" className="text-primary hover:text-primary-light text-sm font-medium">
              View All Subscribers
            </a>
          </div>
        </div>

        {/* Upcoming Newsletters */}
        <div className="bg-dark-card p-6 rounded-lg shadow-dark-md border border-dark-border">
          <h2 className="text-lg font-bold mb-4 text-primary">Upcoming Newsletters</h2>
          <div className="space-y-4">
            {upcomingNewsletters.map((newsletter) => (
              <div key={newsletter.id} className="border border-dark-border rounded-md p-4 bg-dark-lighter">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-light">{newsletter.title}</h3>
                    <div className="flex items-center mt-1 text-sm text-light-muted">
                      <FiCalendar className="mr-1" size={14} />
                      {newsletter.date}
                    </div>
                  </div>
                  <span className={`text-sm px-2 py-1 rounded-full ${newsletter.status === 'Draft'
                    ? 'bg-dark-light text-primary'
                    : 'bg-primary/20 text-primary'
                    }`}>
                    {newsletter.status}
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="text-sm bg-primary text-dark px-3 py-1 rounded-md hover:bg-primary-light">
                    Edit
                  </button>
                  <button className="text-sm bg-dark-light text-light px-3 py-1 rounded-md hover:bg-dark-card border border-dark-border">
                    Preview
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-right">
            <a href="#" className="text-primary hover:text-primary-light text-sm font-medium">
              View All Newsletters
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Access denied component
const AccessDenied = () => {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-md mx-auto bg-dark-card rounded-lg shadow-dark-md p-8 text-center border border-dark-border">
      <div className="text-red-400 mb-4">
        <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-primary mb-2">Access Denied</h2>
      <p className="text-light-muted mb-6">
        You are logged in as {user?.email}, but you do not have administrator privileges.
      </p>
      <button
        onClick={logout}
        className="inline-flex items-center px-4 py-2 border border-dark-border rounded-md shadow-dark-sm text-sm font-medium text-primary bg-dark-light hover:bg-dark-lighter focus:outline-none"
      >
        <FiLogOut className="mr-2" />
        Logout
      </button>
    </div>
  );
};

// Main admin page component with conditional rendering
export default function AdminPage() {
  const { user, loading, isAdmin } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <AdminLayout title="Loading">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  // User is logged in but not an admin
  if (user && !isAdmin) {
    return (
      <AdminLayout title="Access Denied">
        <AccessDenied />
      </AdminLayout>
    );
  }

  // User is logged in and is an admin
  if (user && isAdmin) {
    return (
      <AdminLayout title="Dashboard">
        <Dashboard />
      </AdminLayout>
    );
  }

  // User is not logged in, show login form
  return (
    <AdminLayout title="Login">
      <LoginForm />
    </AdminLayout>
  );
}
