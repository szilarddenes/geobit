import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiSave, FiSend, FiTrash2, FiEye } from 'react-icons/fi';
import { getNewsletter, verifyAdminTokenLocally } from '@/lib/firebase';
import AdminLayout from '@/components/admin/AdminLayout';
import NewsletterEditor from '@/components/admin/NewsletterEditor';
import withAdminAuth from '@/components/admin/withAdminAuth';

export default withAdminAuth(NewsletterEditPage);

function NewsletterEditPage() {
  const [newsletter, setNewsletter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const adminToken = localStorage.getItem('geobit_admin_token');
    if (!adminToken) {
      router.push('/admin');
      return;
    }

    if (id) {
      fetchNewsletter(id);
    }
  }, [id, router]);

  const fetchNewsletter = async (newsletterId) => {
    setIsLoading(true);
    try {
      const adminToken = localStorage.getItem('geobit_admin_token');
      const response = await getNewsletter({
        token: adminToken,
        newsletterId
      });

      if (response.data.success) {
        setNewsletter(response.data.newsletter);
      } else {
        toast.error(response.data.error || 'Failed to fetch newsletter');
        router.push('/admin/newsletters');
      }
    } catch (error) {
      console.error('Error fetching newsletter:', error);

      // Development fallback
      const adminToken = localStorage.getItem('geobit_admin_token');
      if (verifyAdminTokenLocally(adminToken)) {
        // Create mock newsletter for development
        setNewsletter({
          id: newsletterId,
          title: 'Development Mode Newsletter',
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          sections: [
            {
              id: 'section-1',
              title: 'Introduction',
              content: 'This is a sample newsletter created in development mode.\n\nYou can edit this content and see how the editor works.'
            },
            {
              id: 'section-2',
              title: 'Latest Research',
              content: 'Recent studies have shown significant advancements in geoscience fields.\n\nResearchers at several universities published groundbreaking papers last week.'
            },
            {
              id: 'section-3',
              title: 'Industry Updates',
              content: 'Major developments in the geoscience industry this week include new partnerships and technological innovations.'
            }
          ]
        });
        toast.info('Using development mode with sample newsletter data');
      } else {
        toast.error('Failed to fetch newsletter');
        router.push('/admin/newsletters');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNewsletter = async (updatedNewsletter, callback) => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      const adminToken = localStorage.getItem('geobit_admin_token');

      // In a real implementation, you would call your Firebase function here
      // const response = await saveNewsletter({ token: adminToken, newsletter: updatedNewsletter });

      // Development implementation
      console.log('Saving newsletter:', updatedNewsletter);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      // Update local state
      const currentTime = new Date().toISOString();
      const updatedWithTimestamp = {
        ...updatedNewsletter,
        updatedAt: currentTime
      };

      setNewsletter(updatedWithTimestamp);
      setLastSaved(currentTime);
      toast.success('Newsletter saved successfully');

      // Call callback if provided (used for publish workflow)
      if (callback && typeof callback === 'function') {
        callback();
      }
    } catch (error) {
      console.error('Error saving newsletter:', error);
      toast.error('Failed to save newsletter');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishNewsletter = async () => {
    if (isPublishing) return;

    setIsPublishing(true);
    try {
      const adminToken = localStorage.getItem('geobit_admin_token');

      // In a real implementation, you would call your Firebase function here
      // const response = await publishNewsletter({ token: adminToken, newsletterId: newsletter.id });

      // Development implementation
      console.log('Publishing newsletter:', newsletter.id);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Update local state
      const currentTime = new Date().toISOString();
      const publishedNewsletter = {
        ...newsletter,
        status: 'published',
        publishedAt: currentTime,
        updatedAt: currentTime
      };

      setNewsletter(publishedNewsletter);
      setLastSaved(currentTime);
      toast.success('Newsletter published successfully');
    } catch (error) {
      console.error('Error publishing newsletter:', error);
      toast.error('Failed to publish newsletter');
    } finally {
      setIsPublishing(false);
    }
  };

  const handlePreviewNewsletter = () => {
    // Open preview in new tab
    if (newsletter) {
      // In a real implementation, you would redirect to a preview URL
      // window.open(`/newsletters/preview/${newsletter.id}`, '_blank');

      // For development, just show a toast
      toast.info('Preview functionality will be available in production');
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Edit Newsletter - GeoBit Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={() => router.push('/admin/newsletters')}
              className="mr-4 p-2 rounded-full text-gray-600 hover:bg-gray-100"
            >
              <FiArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-slate-800">
              {isLoading ? 'Loading Newsletter...' : `Edit Newsletter: ${newsletter?.title || 'Untitled'}`}
            </h1>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handlePreviewNewsletter}
              className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md transition flex items-center"
              disabled={isLoading || !newsletter}
            >
              <FiEye className="mr-2" />
              Preview
            </button>
          </div>
        </div>

        <div className="flex mt-2 text-sm">
          <div className="flex items-center mr-4 text-gray-600">
            ID: {newsletter?.id || 'Loading...'}
          </div>
          {newsletter && (
            <>
              <div className="flex items-center mr-4 text-gray-600">
                Created: {new Date(newsletter.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center mr-4">
                Status:
                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${newsletter.status === 'published'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                  }`}>
                  {newsletter.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </div>
              {newsletter.publishedAt && (
                <div className="flex items-center text-gray-600">
                  Published: {new Date(newsletter.publishedAt).toLocaleDateString()}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>

            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      ) : newsletter ? (
        <NewsletterEditor
          newsletter={newsletter}
          onSave={handleSaveNewsletter}
          onPublish={handlePublishNewsletter}
          isLoading={isSaving || isPublishing}
          lastSaved={lastSaved}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-600">
          Newsletter not found or failed to load.
        </div>
      )}
    </AdminLayout>
  );
}