import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FiUsers, FiFileText, FiEye, FiCpu, FiSearch, FiRefreshCw, FiLogOut } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import { verifyAdminTokenLocally } from '../../lib/auth';
import { generateNewsletterOnDemand } from '../../lib/api/admin';
import { getApiStatus } from '../../lib/api/status';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export default function AdminHome() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [apiStatus, setApiStatus] = useState(null);
  const [newsletterStatus, setNewsletterStatus] = useState(null);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    subscribers: 0,
    newsletters: 0,
    articles: 0,
    openRate: 0
  });

  useEffect(() => {
    // Check if user is logged in
    const adminToken = localStorage.getItem('geobit_admin_token');

    if (!adminToken) {
      router.push('/admin');
      return;
    }

    const checkAdmin = async () => {
      try {
        const isAdmin = await verifyAdminTokenLocally(adminToken);
        if (!isAdmin) {
          localStorage.removeItem('geobit_admin_token');
          router.push('/admin');
          return;
        }

        setIsLoading(false);
        checkApiStatus();
        fetchRealTimeStats();
      } catch (err) {
        console.error("Error verifying admin:", err);
        setError("Error verifying admin status");
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  const checkApiStatus = async () => {
    setIsRefreshing(true);
    try {
      const status = await getApiStatus();
      setApiStatus(status);

      // Update stats if available in the API status response
      if (status?.stats) {
        setStats(status.stats);
      }
    } catch (err) {
      console.error("Error checking API status:", err);

      // In development mode, let's simulate a response
      if (process.env.NODE_ENV === 'development') {
        setApiStatus({
          status: 'ok',
          services: {
            firebase: 'ok',
            newsletter: 'ok',
            content: 'ok'
          },
          stats: {
            subscribers: 145,
            newsletters: 12,
            articles: 37,
            openRate: 68.5
          }
        });

        // Update stats with simulated data
        setStats({
          subscribers: 145,
          newsletters: 12,
          articles: 37,
          openRate: 68.5
        });
      } else {
        setError("Error checking API status");
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchRealTimeStats = async () => {
    try {
      // In a real application, you would fetch real-time data from your API
      // For this example, we'll simulate real-time data with random variations

      // Base values (in a real app, these would come from your database)
      const baseStats = {
        subscribers: 145,
        newsletters: 12,
        articles: 37,
        openRate: 68.5
      };

      // Simulate real-time variations
      const newStats = {
        subscribers: baseStats.subscribers + Math.floor(Math.random() * 5),
        newsletters: baseStats.newsletters,
        articles: baseStats.articles + Math.floor(Math.random() * 3),
        openRate: (baseStats.openRate + (Math.random() * 2 - 1)).toFixed(1)
      };

      setStats(newStats);
    } catch (err) {
      console.error("Error fetching real-time stats:", err);
    }
  };

  const handleGenerateNewsletter = async () => {
    try {
      setNewsletterStatus({ status: 'generating' });
      console.log('Generating newsletter...');

      const result = await generateNewsletterOnDemand();

      console.log('Newsletter generation result:', result);

      if (result.success === false) {
        throw new Error(result.error || 'Error generating newsletter');
      }

      setNewsletterStatus({ status: 'success', message: result.message });
      toast.success('Newsletter generated successfully!');
    } catch (err) {
      console.error("Error generating newsletter:", err);
      setNewsletterStatus({
        status: 'error',
        message: err.message || "Unknown error generating newsletter"
      });
      toast.error(err.message || "Error generating newsletter");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('geobit_admin_token');
      toast.success('Signed out successfully');
      router.push('/admin');
    } catch (err) {
      console.error("Error signing out:", err);
      toast.error("Error signing out");
    }
  };

  const navigateToProcessContent = () => {
    router.push('/admin/content/process');
  };

  const navigateToSearchNews = () => {
    router.push('/admin/content/search');
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="text-light bg-dark-light p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Error</h2>
          <p>{error}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 h-screen overflow-y-auto pb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-light">Admin Dashboard</h1>

          <div className="flex items-center space-x-3">
            <button
              onClick={checkApiStatus}
              disabled={isRefreshing}
              className="flex items-center space-x-2 bg-dark-light hover:bg-dark-lighter text-primary py-2 px-4 rounded-md transition-colors"
            >
              <FiRefreshCw className={`${isRefreshing ? "animate-spin" : ""}`} />
              <span>{isRefreshing ? "Refreshing..." : "Refresh Status"}</span>
            </button>

            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 bg-red-900/30 hover:bg-red-900/50 text-red-300 py-2 px-4 rounded-md transition-colors"
            >
              <FiLogOut />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* API Status */}
        <div className="bg-dark-lighter border border-dark-border rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold text-light mb-4">System Status</h2>

          {apiStatus ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-dark-light p-4 rounded-lg shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-light-muted text-sm">Subscribers</p>
                      <p className="text-2xl font-bold text-light">{stats.subscribers}</p>
                    </div>
                    <FiUsers className="text-primary text-3xl" />
                  </div>
                </div>

                <div className="bg-dark-light p-4 rounded-lg shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-light-muted text-sm">Newsletters</p>
                      <p className="text-2xl font-bold text-light">{stats.newsletters}</p>
                    </div>
                    <FiFileText className="text-primary text-3xl" />
                  </div>
                </div>

                <div className="bg-dark-light p-4 rounded-lg shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-light-muted text-sm">Articles</p>
                      <p className="text-2xl font-bold text-light">{stats.articles}</p>
                    </div>
                    <FiFileText className="text-primary text-3xl" />
                  </div>
                </div>

                <div className="bg-dark-light p-4 rounded-lg shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-light-muted text-sm">Open Rate</p>
                      <p className="text-2xl font-bold text-light">{stats.openRate}%</p>
                    </div>
                    <FiEye className="text-primary text-3xl" />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="p-4 bg-dark-light rounded-lg shadow flex-1 min-w-[300px]">
                  <h3 className="text-light font-bold text-lg mb-3">Service Status</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-light-muted">Firebase</span>
                      <span className={`${apiStatus.services?.firebase === 'ok' ? 'text-green-500' : 'text-red-500'
                        }`}>
                        {apiStatus.services?.firebase === 'ok' ? 'Operational' : 'Down'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-light-muted">Newsletter Service</span>
                      <span className={`${apiStatus.services?.newsletter === 'ok' ? 'text-green-500' : 'text-red-500'
                        }`}>
                        {apiStatus.services?.newsletter === 'ok' ? 'Operational' : 'Down'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-light-muted">Content Service</span>
                      <span className={`${apiStatus.services?.content === 'ok' ? 'text-green-500' : 'text-red-500'
                        }`}>
                        {apiStatus.services?.content === 'ok' ? 'Operational' : 'Down'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-dark-light rounded-lg shadow flex-1 min-w-[300px]">
                  <h3 className="text-light font-bold text-lg mb-3">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <button
                      className="p-2 flex items-center justify-center bg-primary hover:bg-primary/80 rounded text-dark font-bold transition-colors"
                      onClick={() => router.push('/admin/subscribers')}
                    >
                      <FiUsers className="mr-2" />
                      Manage Subscribers
                    </button>

                    <button
                      className="p-2 flex items-center justify-center bg-primary hover:bg-primary/80 rounded text-dark font-bold transition-colors"
                      onClick={handleGenerateNewsletter}
                      disabled={newsletterStatus?.status === 'generating'}
                    >
                      {newsletterStatus?.status === 'generating' ? (
                        <span className="flex items-center">
                          <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-dark rounded-full"></span>
                          Generating...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <FiFileText className="mr-2" />
                          Generate Newsletter
                        </span>
                      )}
                    </button>

                    <button
                      className="p-2 flex items-center justify-center bg-dark-border hover:bg-dark-border/80 rounded text-light font-bold transition-colors"
                      onClick={navigateToProcessContent}
                    >
                      <FiCpu className="mr-2" />
                      Process Content
                    </button>

                    <button
                      className="p-2 flex items-center justify-center bg-dark-border hover:bg-dark-border/80 rounded text-light font-bold transition-colors"
                      onClick={navigateToSearchNews}
                    >
                      <FiSearch className="mr-2" />
                      Search News
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-light">
              <p>Loading system status...</p>
            </div>
          )}
        </div>

        {/* Analytics & Monitoring with Real-Time Data */}
        <div className="bg-dark-lighter border border-dark-border rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold text-light mb-4">Analytics & Monitoring</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-dark-light p-4 rounded-lg shadow">
              <h3 className="text-light font-medium mb-3">Recent Activity</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-dark rounded">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-light">New subscriber</span>
                  </div>
                  <span className="text-light-muted text-sm">2 minutes ago</span>
                </div>

                <div className="flex justify-between items-center p-2 bg-dark rounded">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-light">Newsletter opened</span>
                  </div>
                  <span className="text-light-muted text-sm">15 minutes ago</span>
                </div>

                <div className="flex justify-between items-center p-2 bg-dark rounded">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                    <span className="text-light">Content processed</span>
                  </div>
                  <span className="text-light-muted text-sm">1 hour ago</span>
                </div>
              </div>
            </div>

            <div className="bg-dark-light p-4 rounded-lg shadow">
              <h3 className="text-light font-medium mb-3">Performance Metrics</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-light-muted text-sm">API Requests</span>
                    <span className="text-light text-sm">{Math.floor(Math.random() * 1000 + 5000)}/day</span>
                  </div>
                  <div className="w-full bg-dark rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-light-muted text-sm">CPU Usage</span>
                    <span className="text-light text-sm">{Math.floor(Math.random() * 20 + 30)}%</span>
                  </div>
                  <div className="w-full bg-dark rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-light-muted text-sm">Memory Usage</span>
                    <span className="text-light text-sm">{Math.floor(Math.random() * 30 + 60)}%</span>
                  </div>
                  <div className="w-full bg-dark rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}