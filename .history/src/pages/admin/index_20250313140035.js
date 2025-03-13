import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiCalendar, FiFileText, FiSettings, FiPlusCircle, FiBarChart } from 'react-icons/fi';
import Head from 'next/head';
import { adminLogin } from '@/lib/firebase';

// Simple admin layout
const AdminLayout = ({ children, title }) => {
  return (
    <>
      <Head>
        <title>{title} - GeoBit Admin</title>
        <meta name="description" content="GeoBit Administration" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-gray-900 text-white py-4">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">GeoBit Admin</h1>
            <div>
              <span className="inline-flex items-center">
                <FiUser className="mr-2" />
                Admin
              </span>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">{title}</h1>
          {children}
        </div>
      </div>
    </>
  );
};

// Login form component
const LoginForm = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      setError('Please enter the admin password');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // Use Firebase admin login with the provided password
      const result = await adminLogin({ password });

      if (result.data.success) {
        // Store the admin token in localStorage
        localStorage.setItem('geobit_admin_token', result.data.token);
        onLogin(true);
      } else {
        setError(result.data.error || 'Invalid password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
      <h2 className="text-xl font-bold mb-6 text-center">Admin Login</h2>

      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter admin password"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

// Dashboard component
const Dashboard = () => {
  // Sample dashboard data
  const stats = [
    { label: 'Total Subscribers', value: '5,234', icon: <FiUser className="text-blue-500" /> },
    { label: 'Newsletters Sent', value: '137', icon: <FiMail className="text-green-500" /> },
    { label: 'Articles Published', value: '428', icon: <FiFileText className="text-purple-500" /> },
    { label: 'Avg. Open Rate', value: '42.8%', icon: <FiBarChart className="text-amber-500" /> }
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
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm flex items-start gap-4">
            <div className="p-3 bg-gray-100 rounded-full">
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            <FiPlusCircle className="mr-2" />
            New Newsletter
          </button>
          <button className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            <FiFileText className="mr-2" />
            Add Article
          </button>
          <button className="flex items-center bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
            <FiMail className="mr-2" />
            Manage Subscribers
          </button>
          <button className="flex items-center bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
            <FiSettings className="mr-2" />
            Settings
          </button>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Subscribers */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-bold mb-4">Recent Subscribers</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left text-sm font-medium text-gray-500">Email</th>
                  <th className="py-2 text-left text-sm font-medium text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="border-b">
                    <td className="py-3 text-gray-900">{subscriber.email}</td>
                    <td className="py-3 text-gray-500">{subscriber.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right">
            <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All Subscribers
            </a>
          </div>
        </div>

        {/* Upcoming Newsletters */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-bold mb-4">Upcoming Newsletters</h2>
          <div className="space-y-4">
            {upcomingNewsletters.map((newsletter) => (
              <div key={newsletter.id} className="border border-gray-200 rounded-md p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{newsletter.title}</h3>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <FiCalendar className="mr-1" size={14} />
                      {newsletter.date}
                    </div>
                  </div>
                  <span className={`text-sm px-2 py-1 rounded-full ${newsletter.status === 'Draft'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                    }`}>
                    {newsletter.status}
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200">
                    Edit
                  </button>
                  <button className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-200">
                    Preview
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-right">
            <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All Newsletters
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check for existing login
  useEffect(() => {
    const adminToken = localStorage.getItem('geobit_admin_token');
    if (adminToken) {
      setIsLoggedIn(true);
    }
  }, []);

  // Handle login
  const handleLogin = (success) => {
    if (success) {
      setIsLoggedIn(true);
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <AdminLayout title="Dashboard">
          <Dashboard />
        </AdminLayout>
      ) : (
        <AdminLayout title="Admin Login">
          <LoginForm onLogin={handleLogin} />
        </AdminLayout>
      )}
    </>
  );
}
