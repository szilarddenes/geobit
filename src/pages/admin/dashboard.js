import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { 
  generateNewsletterOnDemand, 
  verifyAdminTokenLocally,
  getApiStatus
} from '@/lib/firebase';
import { FiRss, FiSettings, FiFileText, FiUsers, FiBarChart2, FiEdit, FiArchive, FiRefreshCw } from 'react-icons/fi';

// Admin components
import AdminLayout from '@/components/admin/AdminLayout';
import ApiStatusIndicator from '@/components/admin/ApiStatusIndicator';

export default function AdminDashboard() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiStatus, setApiStatus] = useState({
    openRouter: { status: 'unknown', message: 'Checking status...' },
    firebase: { status: 'unknown', message: 'Checking status...' },
    email: { status: 'unknown', message: 'Checking status...' }
  });
  const [isRefreshingStatus, setIsRefreshingStatus] = useState(false);
  const router = useRouter();

  // Check if logged in
  useEffect(() => {
    const adminToken = localStorage.getItem('geobit_admin_token');
    if (!adminToken) {
      router.push('/admin');
      return;
    }

    // For development - check if token is a development token
    if (adminToken.startsWith('dev-admin-')) {
      console.log('Using development admin token');
      return; // Allow access with development token
    }

    // In production, we would verify the token with the server
    checkApiStatus();
  }, [router]);

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
        router.push('/admin');
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

  return (
    <AdminLayout>
      <Head>
        <title>Admin Dashboard - GeoBit</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Dashboard
        </h1>
        <button 
          onClick={checkApiStatus}
          disabled={isRefreshingStatus}
          className="flex items-center gap-2 text-sm bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-1 px-3 rounded-md transition"
        >
          <FiRefreshCw className={`${isRefreshingStatus ? 'animate-spin' : ''}`} />
          {isRefreshingStatus ? 'Refreshing...' : 'Refresh Status'}
        </button>
      </div>

      {/* API Status */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
          <FiSettings className="mr-2" /> System Status
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
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
            <FiEdit className="mr-2" /> Content Management
          </h2>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-medium text-slate-700 mb-2">Newsletter Generation</h3>
              <p className="text-slate-600 mb-4 text-sm">
                Generate a new newsletter with AI-powered summaries of the latest geoscience content.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleGenerateNewsletter}
                  disabled={isGenerating}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
                >
                  {isGenerating ? 'Generating...' : 'Generate New Newsletter'}
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-slate-700 mb-2">Content Collection</h3>
              <p className="text-slate-600 mb-4 text-sm">
                Search for new content or manage your content sources.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/admin/content/collect"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 inline-block"
                >
                  Collect New Content
                </Link>
                <Link
                  href="/admin/sources"
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 inline-block"
                >
                  Manage Sources
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
            <FiBarChart2 className="mr-2" /> Analytics & Monitoring
          </h2>
          
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-medium text-slate-700 mb-2">Key Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-md">
                  <p className="text-slate-500 text-xs mb-1">Subscribers</p>
                  <p className="text-2xl font-bold">247</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-md">
                  <p className="text-slate-500 text-xs mb-1">Open Rate</p>
                  <p className="text-2xl font-bold">38.2%</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-md">
                  <p className="text-slate-500 text-xs mb-1">Newsletters</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-md">
                  <p className="text-slate-500 text-xs mb-1">Articles</p>
                  <p className="text-2xl font-bold">148</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-slate-700 mb-2">Tools & Reports</h3>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/admin/analytics"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 inline-block"
                >
                  View Analytics
                </Link>
                <Link
                  href="/admin/logs"
                  className="bg-slate-600 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 inline-block"
                >
                  System Logs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
            <FiUsers className="mr-2" /> Audience
          </h2>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-medium text-slate-700 mb-2">Subscriber Management</h3>
              <p className="text-slate-600 mb-4 text-sm">
                View and manage your newsletter subscribers.
              </p>
              <Link
                href="/admin/subscribers"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 inline-block"
              >
                Manage Subscribers
              </Link>
            </div>
            
            <div>
              <h3 className="font-medium text-slate-700 mb-2">Recent Signups</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm p-2 bg-slate-50 rounded">
                  <span className="text-slate-700">john.doe@example.com</span>
                  <span className="text-slate-500 text-xs">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between text-sm p-2 bg-slate-50 rounded">
                  <span className="text-slate-700">jane.smith@university.edu</span>
                  <span className="text-slate-500 text-xs">5 hours ago</span>
                </div>
                <div className="flex items-center justify-between text-sm p-2 bg-slate-50 rounded">
                  <span className="text-slate-700">researcher@geo.org</span>
                  <span className="text-slate-500 text-xs">yesterday</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
            <FiArchive className="mr-2" /> Archives & Publishing
          </h2>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-medium text-slate-700 mb-2">Newsletter Archives</h3>
              <p className="text-slate-600 mb-4 text-sm">
                View and edit past newsletters.
              </p>
              <Link
                href="/admin/newsletters"
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 inline-block"
              >
                View Archives
              </Link>
            </div>
            
            <div>
              <h3 className="font-medium text-slate-700 mb-2">Latest Newsletters</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm p-2 bg-slate-50 rounded">
                  <span className="text-slate-700">Weekly Roundup - March 13, 2025</span>
                  <span className="bg-green-100 text-green-800 text-xs py-1 px-2 rounded-full">Published</span>
                </div>
                <div className="flex items-center justify-between text-sm p-2 bg-slate-50 rounded">
                  <span className="text-slate-700">Research Highlights - March 10, 2025</span>
                  <span className="bg-green-100 text-green-800 text-xs py-1 px-2 rounded-full">Published</span>
                </div>
                <div className="flex items-center justify-between text-sm p-2 bg-slate-50 rounded">
                  <span className="text-slate-700">Weekly Roundup - March 6, 2025</span>
                  <span className="bg-green-100 text-green-800 text-xs py-1 px-2 rounded-full">Published</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}