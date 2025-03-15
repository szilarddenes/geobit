import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useRouter } from 'next/router';
import { FiUsers, FiFileText, FiPieChart, FiEye, FiPlus, FiCpu, FiSearch } from 'react-icons/fi';
import { verifyAdminTokenLocally } from '../../lib/auth';
import { generateNewsletterOnDemand } from '../../lib/api/admin';
import { getApiStatus } from '../../lib/api/status';

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState(null);
  const [newsletterStatus, setNewsletterStatus] = useState(null);
  const [error, setError] = useState(null);

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
      } catch (err) {
        console.error("Error verifying admin:", err);
        setError("Error verifying admin status");
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  const checkApiStatus = async () => {
    try {
      const status = await getApiStatus();
      setApiStatus(status);
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
      } else {
        setError("Error checking API status");
      }
    }
  };

  const handleGenerateNewsletter = async () => {
    try {
      setNewsletterStatus({ status: 'generating' });
      const result = await generateNewsletterOnDemand();
      setNewsletterStatus({ status: 'success', message: result.message });
    } catch (err) {
      console.error("Error generating newsletter:", err);

      // In development mode, let's simulate a response
      if (process.env.NODE_ENV === 'development') {
        setTimeout(() => {
          setNewsletterStatus({
            status: 'success',
            message: 'Newsletter generated successfully! It has been sent to 145 subscribers.'
          });
        }, 3000);
      } else {
        setNewsletterStatus({ status: 'error', message: err.message || "Unknown error generating newsletter" });
      }
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
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-light">Admin Dashboard</h1>

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
                      <p className="text-2xl font-bold text-light">{apiStatus.stats?.subscribers || 0}</p>
                    </div>
                    <FiUsers className="text-primary text-3xl" />
                  </div>
                </div>

                <div className="bg-dark-light p-4 rounded-lg shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-light-muted text-sm">Newsletters</p>
                      <p className="text-2xl font-bold text-light">{apiStatus.stats?.newsletters || 0}</p>
                    </div>
                    <FiFileText className="text-primary text-3xl" />
                  </div>
                </div>

                <div className="bg-dark-light p-4 rounded-lg shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-light-muted text-sm">Articles</p>
                      <p className="text-2xl font-bold text-light">{apiStatus.stats?.articles || 0}</p>
                    </div>
                    <FiFileText className="text-primary text-3xl" />
                  </div>
                </div>

                <div className="bg-dark-light p-4 rounded-lg shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-light-muted text-sm">Open Rate</p>
                      <p className="text-2xl font-bold text-light">{apiStatus.stats?.openRate || 0}%</p>
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

              {newsletterStatus && newsletterStatus.status !== 'generating' && (
                <div className={`p-4 rounded-lg ${newsletterStatus.status === 'success' ? 'bg-green-900/20 text-green-500' : 'bg-red-900/20 text-red-500'
                  }`}>
                  <p>{newsletterStatus.message}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}