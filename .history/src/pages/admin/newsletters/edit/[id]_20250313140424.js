import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { toast } from 'react-toastify';
import { publishNewsletter, getNewsletter } from '@/lib/firebase';

// Admin components
import AdminLayout from '@/components/admin/AdminLayout';

export default function EditNewsletterPage() {
    const [newsletter, setNewsletter] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPublishing, setIsPublishing] = useState(false);
    const router = useRouter();
    const { id } = router.query;

    // Check if logged in
    useEffect(() => {
        const adminToken = localStorage.getItem('geobit_admin_token');
        if (!adminToken) {
            router.push('/admin');
            return;
        }

        // If we have an ID, fetch the newsletter
        if (id) {
            fetchNewsletter(id, adminToken);
        }
    }, [id, router]);

    const fetchNewsletter = async (newsletterId, token) => {
        setIsLoading(true);

        try {
            const result = await getNewsletter({
                token,
                newsletterId
            });

            if (result.data.success) {
                setNewsletter(result.data.newsletter);
            } else {
                toast.error(result.data.error || 'Failed to load newsletter');
            }
        } catch (error) {
            console.error('Error fetching newsletter:', error);
            toast.error('Failed to load newsletter. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePublishNewsletter = async () => {
        if (isPublishing || !newsletter) return;

        setIsPublishing(true);

        try {
            const adminToken = localStorage.getItem('geobit_admin_token');
            if (!adminToken) {
                toast.error('You must be logged in as an admin to perform this action');
                router.push('/admin');
                return;
            }

            const result = await publishNewsletter({
                token: adminToken,
                newsletterId: newsletter.id
            });

            if (result.data.success) {
                toast.success('Newsletter published successfully');

                // Update local state to reflect published status
                setNewsletter({
                    ...newsletter,
                    status: 'published'
                });
            } else {
                toast.error(result.data.error || 'Failed to publish newsletter');
            }
        } catch (error) {
            console.error('Error publishing newsletter:', error);
            toast.error('Failed to publish newsletter. Please try again.');
        } finally {
            setIsPublishing(false);
        }
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500">Loading newsletter...</p>
                </div>
            </AdminLayout>
        );
    }

    if (!newsletter) {
        return (
            <AdminLayout>
                <div className="flex flex-col items-center justify-center h-64">
                    <p className="text-gray-500 mb-4">Newsletter not found</p>
                    <button
                        onClick={() => router.push('/admin/dashboard')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <Head>
                <title>Edit Newsletter - GeoBit Admin</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-800">
                    Edit Newsletter
                </h1>
                <div className="flex space-x-2">
                    <button
                        onClick={() => router.push('/admin/dashboard')}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handlePublishNewsletter}
                        disabled={isPublishing || newsletter.status === 'published'}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
                    >
                        {isPublishing ? 'Publishing...' :
                            newsletter.status === 'published' ? 'Published' : 'Publish Newsletter'}
                    </button>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">{newsletter.title}</h2>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${newsletter.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {newsletter.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                    </div>

                    <div className="mb-6">
                        <p className="text-sm text-gray-500">
                            Created: {new Date(newsletter.createdAt).toLocaleString()}
                        </p>
                    </div>

                    <div className="space-y-6">
                        {newsletter.content.map((item, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                                <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                                <p className="text-gray-700 mb-2">{item.summary}</p>
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Original Article
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
} 