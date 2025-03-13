import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { generateNewsletterOnDemand, verifyAdminTokenLocally } from '@/lib/firebase';
import { generateNewsletterOnDemand } from '@/lib/firebase';

// Admin components
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminDashboard() {
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  // Check if logged in
  useEffect(() => {
    const adminToken = localStorage.getItem('geobit_admin_token');
    if (!adminToken) {
      router.push('/admin');
    }
  }, [router]);

  const handleGenerateNewsletter = async () => {
    if (isGenerating) return;

    setIsGenerating(true);

    try {
      const adminToken = localStorage.getItem('geobit_admin_token');
      if (!adminToken) {
        toast.error('You must be logged in as an admin to perform this action');
        router.push('/admin');
        return;
      }

      const result = await generateNewsletterOnDemand({ token: adminToken });

      if (result.data.success) {
        toast.success('Newsletter generated successfully');

        // Redirect to newsletter editor
        router.push(`/admin/newsletters/edit/${result.data.newsletterId}`);
      } else {
        toast.error(result.data.error || 'Failed to generate newsletter');
      }
    } catch (error) {
      console.error('Error generating newsletter:', error);
      toast.error('Failed to generate newsletter. Please try again.');
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

      <h1 className="text-2xl font-bold text-slate-800 mb-6">
        Dashboard
      </h1>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Newsletter</h2>
          <p className="text-slate-600 mb-4">
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
            <Link
              href="/admin/sources/search"
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 inline-block"
            >
              Search New Articles
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Content Sources</h2>
          <p className="text-slate-600 mb-4">
            Manage the sources GeoBit uses to collect geoscience content.
          </p>
          <Link
            href="/admin/sources"
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 inline-block"
          >
            Manage Sources
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Subscribers</h2>
          <p className="text-slate-600 mb-4">
            View and manage your newsletter subscribers.
          </p>
          <Link
            href="/admin/subscribers"
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 inline-block"
          >
            Manage Subscribers
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Archives</h2>
          <p className="text-slate-600 mb-4">
            View and edit past newsletters.
          </p>
          <Link
            href="/admin/newsletters"
            className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 inline-block"
          >
            View Archives
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}