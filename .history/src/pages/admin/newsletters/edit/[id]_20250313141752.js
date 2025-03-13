import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { toast } from 'react-toastify';
import { publishNewsletter, getNewsletter } from '@/lib/firebase';
import { suggestNewsletterTitle, generateSummary } from '@/lib/openrouter';

// Admin components
import AdminLayout from '@/components/admin/AdminLayout';

export default function EditNewsletterPage() {
    const [newsletter, setNewsletter] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPublishing, setIsPublishing] = useState(false);
    const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
    const [editableTitle, setEditableTitle] = useState('');
    const [regeneratingIndex, setRegeneratingIndex] = useState(null);
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

    // Update editable title when newsletter data is loaded
    useEffect(() => {
        if (newsletter?.title) {
            setEditableTitle(newsletter.title);
        }
    }, [newsletter]);

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

            // First update the title if it's changed
            if (editableTitle !== newsletter.title) {
                // In a real application, you would update the title with an API call
                // For now, we'll just update the local state
                setNewsletter({
                    ...newsletter,
                    title: editableTitle
                });
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
                    status: 'published',
                    title: editableTitle
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

    const handleGenerateTitleSuggestion = async () => {
        if (!newsletter?.content || isGeneratingTitle) return;

        setIsGeneratingTitle(true);

        try {
            const titleSuggestion = await suggestNewsletterTitle(newsletter.content);
            setEditableTitle(titleSuggestion);
            toast.success('Title suggestion generated');
        } catch (error) {
            console.error('Error generating title suggestion:', error);
            toast.error('Failed to generate title. Please try again.');
        } finally {
            setIsGeneratingTitle(false);
        }
    };

    const handleRegenerateSummary = async (item, index) => {
        if (regeneratingIndex !== null || !item.content) return;
        
        setRegeneratingIndex(index);
        
        try {
            // Extract text content from HTML (simplified)
            const textContent = item.content.toString()
                .replace(/<[^>]*>/g, ' ')
                .replace(/\s+/g, ' ')
                .trim()
                .substring(0, 4000);
                
            // Generate new summary
            const newSummary = await generateSummary(textContent);
            
            // Update the newsletter content with new summary
            const updatedContent = [...newsletter.content];
            updatedContent[index] = {
                ...updatedContent[index],
                summary: newSummary
            };
            
            // Update local state
            setNewsletter({
                ...newsletter,
                content: updatedContent
            });
            
            toast.success('Summary regenerated successfully');
        } catch (error) {
            console.error('Error regenerating summary:', error);
            toast.error('Failed to regenerate summary. Please try again.');
        } finally {
            setRegeneratingIndex(null);
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
                        onClick={() => router.push('/admin/newsletters')}
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

            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
                <div className="p-6">
                    <div className="mb-6">
                        <label htmlFor="newsletter-title" className="block text-sm font-medium text-gray-700 mb-2">
                            Newsletter Title
                        </label>
                        <div className="flex gap-2">
                            <input
                                id="newsletter-title"
                                type="text"
                                value={editableTitle}
                                onChange={(e) => setEditableTitle(e.target.value)}
                                className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                                placeholder="Newsletter Title"
                                disabled={newsletter.status === 'published'}
                            />
                            <button
                                onClick={handleGenerateTitleSuggestion}
                                disabled={isGeneratingTitle || newsletter.status === 'published'}
                                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 text-sm"
                            >
                                {isGeneratingTitle ? 'Generating...' : 'Suggest Title'}
                            </button>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                            Click "Suggest Title" to generate an AI-powered title based on the newsletter content.
                        </p>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${newsletter.status === 'published'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {newsletter.status === 'published' ? 'Published' : 'Draft'}
                            </span>
                            <span className="ml-2 text-sm text-gray-500">
                                Created: {new Date(newsletter.createdAt.seconds * 1000).toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold mb-4 mt-6">Newsletter Content</h3>
                    <div className="space-y-6">
                        {newsletter.content.map((item, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                                <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-gray-700 flex-1 pr-4">{item.summary}</p>
                                    {newsletter.status !== 'published' && (
                                        <button
                                            onClick={() => handleRegenerateSummary(item, index)}
                                            disabled={regeneratingIndex === index}
                                            className="flex-shrink-0 bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-md hover:bg-indigo-200"
                                        >
                                            {regeneratingIndex === index ? 'Regenerating...' : 'Regenerate Summary'}
                                        </button>
                                    )}
                                </div>
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