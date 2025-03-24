import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { toast } from 'react-toastify';
import ArticleSearch from '@/components/admin/ArticleSearch';
import AdminLayout from '@/components/admin/AdminLayout';
import { addContentSource } from '@/lib/firebase';
import withAdminAuth from '@/components/admin/withAdminAuth';

export default withAdminAuth(function ArticleSearchPage() {
    const [selectedArticles, setSelectedArticles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    // Check if logged in
    useEffect(() => {
        const adminToken = localStorage.getItem('geobit_admin_token');
        if (!adminToken) {
            router.push('/admin');
        }
    }, [router]);

    const handleArticleSelect = (article) => {
        // Check if article already exists in selection
        const exists = selectedArticles.some(a => a.url === article.url);

        if (!exists) {
            setSelectedArticles([...selectedArticles, article]);
            toast.success('Article added to selection');
        } else {
            toast.info('Article already in your selection');
        }
    };

    const handleRemoveArticle = (index) => {
        const newSelection = [...selectedArticles];
        newSelection.splice(index, 1);
        setSelectedArticles(newSelection);
        toast.info('Article removed from selection');
    };

    const handleAddToSources = async () => {
        if (selectedArticles.length === 0 || isSubmitting) return;

        setIsSubmitting(true);

        try {
            const adminToken = localStorage.getItem('geobit_admin_token');
            if (!adminToken) {
                toast.error('You must be logged in as an admin to perform this action');
                router.push('/admin');
                return;
            }

            // Add each selected article as a content source
            const results = await Promise.all(
                selectedArticles.map(article =>
                    addContentSource({
                        token: adminToken,
                        name: article.title,
                        url: article.url,
                        category: 'article'
                    })
                )
            );

            const successCount = results.filter(result => result.data.success).length;

            if (successCount > 0) {
                toast.success(`${successCount} articles added to content sources`);
                setSelectedArticles([]);

                // Redirect to sources page
                router.push('/admin/sources');
            } else {
                toast.error('Failed to add articles to sources');
            }
        } catch (error) {
            console.error('Error adding articles to sources:', error);
            toast.error('Failed to add articles to sources. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AdminLayout>
            <Head>
                <title>Article Search - GeoBit Admin</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-800">
                    Search Geoscience Articles
                </h1>
                <div className="flex space-x-2">
                    <button
                        onClick={() => router.push('/admin/sources')}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-200"
                    >
                        Back to Sources
                    </button>
                    <button
                        onClick={handleAddToSources}
                        disabled={selectedArticles.length === 0 || isSubmitting}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Adding...' : `Add ${selectedArticles.length} Articles to Sources`}
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <ArticleSearch onArticleSelect={handleArticleSelect} />
                </div>

                <div className="bg-white shadow-md rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Selected Articles {selectedArticles.length > 0 && `(${selectedArticles.length})`}</h3>

                    {selectedArticles.length === 0 ? (
                        <p className="text-center text-gray-500 py-6">
                            No articles selected. Search and click on articles to add them here.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {selectedArticles.map((article, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
                                    <button
                                        onClick={() => handleRemoveArticle(index)}
                                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                    >
                                        ✕
                                    </button>

                                    <h4 className="font-medium pr-6">{article.title}</h4>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {article.authors} • {article.date}
                                    </p>
                                    <p className="text-sm mt-2">{article.description}</p>
                                    <a
                                        href={article.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-500 hover:text-blue-700 mt-2 inline-block"
                                    >
                                        View Original
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}); 