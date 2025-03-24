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
import { useAuth } from '@/lib/firebase/auth';
import withAdminAuth from '@/components/admin/withAdminAuth';
import LoadingState from '@/components/LoadingState';

function AdminDashboard() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
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
    console.log("AdminHome component mounted");

    // In development mode, bypass admin check
    if (process.env.NODE_ENV === 'development') {
      console.log("Development mode: bypassing strict admin check");
      setIsLoading(false);
      checkApiStatus();
      fetchRealTimeStats();
      return;
    }

    // Check if user is logged in
    const adminToken = localStorage.getItem('geobit_admin_token');
    console.log("Admin token present:", !!adminToken);

    if (!adminToken) {
      router.push('/admin/login');
      return;
    }

    const checkAdmin = async () => {
      try {
        console.log("Verifying admin token...");
        const isAdmin = await verifyAdminTokenLocally(adminToken);
        console.log("Admin verification result:", isAdmin);

        if (!isAdmin) {
          localStorage.removeItem('geobit_admin_token');
          router.push('/admin/login');
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
    console.log("Checking API status...");
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
        console.log("Development mode: using mock API status");
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
    console.log("Fetching real-time stats...");
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
      console.log("Stats updated:", newStats);
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
      router.push('/admin/login');
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

  console.log("Render state:", { isLoading, error, apiStatus });

  if (isLoading) {
    return (
      <AdminLayout title="Dashboard">
        <LoadingState message="Loading dashboard data..." />
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
    <AdminLayout title="Dashboard">
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

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Subscribers */}
          <div className="bg-dark-card rounded-lg shadow-dark-md border border-dark-border">
            <div className="px-6 py-4 border-b border-dark-border">
              <h2 className="text-lg font-bold text-primary">Recent Subscribers</h2>
            </div>
            <div className="p-4">
              <ul className="divide-y divide-dark-border">
                {recentSubscribers.map((subscriber) => (
                  <li key={subscriber.id} className="py-3 flex justify-between">
                    <span className="text-light">{subscriber.email}</span>
                    <span className="text-light-muted text-sm">{subscriber.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Upcoming Newsletters */}
          <div className="bg-dark-card rounded-lg shadow-dark-md border border-dark-border">
            <div className="px-6 py-4 border-b border-dark-border">
              <h2 className="text-lg font-bold text-primary">Upcoming Newsletters</h2>
            </div>
            <div className="p-4">
              <ul className="divide-y divide-dark-border">
                {upcomingNewsletters.map((newsletter) => (
                  <li key={newsletter.id} className="py-3">
                    <div className="flex justify-between">
                      <span className="text-light">{newsletter.title}</span>
                      <span className="text-light-muted text-sm">{newsletter.date}</span>
                    </div>
                    <div className="mt-1">
                      <span className={`text-xs px-2 py-1 rounded ${newsletter.status === 'Draft' ? 'bg-blue-900 text-blue-200' : 'bg-green-900 text-green-200'
                        }`}>
                        {newsletter.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-dark-card p-6 rounded-lg shadow-dark-md border border-dark-border">
          <h2 className="text-lg font-bold mb-4 text-primary">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center bg-primary text-dark px-4 py-2 rounded-md hover:bg-primary-light">
              <FiFileText className="mr-2" />
              New Newsletter
            </button>
            <button className="flex items-center bg-dark-light text-light px-4 py-2 rounded-md hover:bg-dark-lighter border border-dark-border">
              <FiFileText className="mr-2" />
              Add Content
            </button>
            <button className="flex items-center bg-dark-light text-light px-4 py-2 rounded-md hover:bg-dark-lighter border border-dark-border">
              <FiUser className="mr-2" />
              Manage Subscribers
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAdminAuth(AdminDashboard);