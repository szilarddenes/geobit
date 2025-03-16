import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiLoader, FiCpu, FiCheckCircle, FiAlertCircle, FiCheck, FiAlertTriangle } from 'react-icons/fi';

// Admin components
import AdminLayout from '@/components/admin/AdminLayout';
import { processArticleContent } from '@/lib/api/ai';

export default function ProcessContent() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        url: '',
        title: '',
        content: ''
    });
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            // Validate inputs
            if (!formData.url || !formData.title || !formData.content) {
                throw new Error('All fields are required');
            }

            console.log('Processing content with params:', {
                url: formData.url,
                title: formData.title,
                contentLength: formData.content.length
            });

            // Process content with AI
            const response = await processArticleContent({
                url: formData.url,
                title: formData.title,
                content: formData.content
            });

            console.log('Processing result:', response);

            if (response.success === false) {
                throw new Error(response.error || 'Error processing content');
            }

            setResult(response);
            toast.success('Content processed successfully!');
        } catch (err) {
            console.error('Content processing error:', err);
            setError(err.message || 'An error occurred while processing content');
            toast.error(err.message || 'An error occurred while processing content');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveToLibrary = async () => {
        if (!result) return;

        toast.info('Saving to library...');

        // In a real implementation, this would save the processed article to your content library
        // For now, just show a success message after a delay
        setTimeout(() => {
            toast.success('Article saved to content library');
            // Redirect to content library or dashboard
            router.push('/admin/dashboard');
        }, 1500);
    };

    return (
        <AdminLayout>
            <Head>
                <title>Process Content with AI - GeoBit Admin</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-light">Process Content with AI</h1>
                    <div className="flex items-center text-light-muted bg-dark-lighter px-3 py-1 rounded-md">
                        <FiCpu className="mr-2" />
                        <span>AI-Powered Analysis</span>
                    </div>
                </div>

                <div className="bg-dark-lighter border border-dark-border rounded-lg p-6 shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="url" className="block text-light mb-1 font-medium">
                                Article URL
                            </label>
                            <input
                                type="url"
                                id="url"
                                className="w-full p-2 rounded bg-dark border border-dark-border text-light focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="https://example.com/article"
                                value={formData.url}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="title" className="block text-light mb-1 font-medium">
                                Article Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                className="w-full p-2 rounded bg-dark border border-dark-border text-light focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Enter article title"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label htmlFor="content" className="block text-light mb-1 font-medium">
                                Article Content
                            </label>
                            <textarea
                                id="content"
                                rows="8"
                                className="w-full p-2 rounded bg-dark border border-dark-border text-light focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Paste article content here"
                                value={formData.content}
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-primary hover:bg-primary/80 text-dark font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-primary transition-colors disabled:opacity-50"
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-dark rounded-full"></span>
                                        Processing...
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        <FiCpu className="mr-2" />
                                        Process with AI
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>

                    {error && (
                        <div className="mt-6 p-4 bg-red-900/20 text-red-500 rounded-lg flex items-start">
                            <FiAlertTriangle className="mr-2 mt-1 flex-shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    {result && (
                        <div className="mt-6 p-4 bg-dark-light rounded-lg border border-dark-border">
                            <h3 className="text-lg font-bold text-light mb-4 flex items-center">
                                <FiCheck className="text-green-500 mr-2" />
                                Processed Content
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-primary font-medium mb-1">Summary</h4>
                                    <p className="text-light">{result.summary}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-primary font-medium mb-1">Categories</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {result.categories?.map((category, i) => (
                                                <span key={i} className="bg-dark-border px-2 py-1 rounded text-light text-sm">
                                                    {category}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-primary font-medium mb-1">Keywords</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {result.keywords?.map((keyword, i) => (
                                                <span key={i} className="bg-dark-border px-2 py-1 rounded text-light text-sm">
                                                    {keyword}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <h4 className="text-primary font-medium mb-1">Sentiment</h4>
                                        <p className="text-light capitalize">{result.sentiment}</p>
                                    </div>

                                    <div>
                                        <h4 className="text-primary font-medium mb-1">Relevance Score</h4>
                                        <p className="text-light">{result.relevanceScore * 100}%</p>
                                    </div>

                                    <div>
                                        <h4 className="text-primary font-medium mb-1">Readability</h4>
                                        <p className="text-light capitalize">{result.readabilityScore}</p>
                                    </div>
                                </div>

                                {result.aiInsights && (
                                    <div>
                                        <h4 className="text-primary font-medium mb-1">AI Insights</h4>
                                        <p className="text-light">{result.aiInsights}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
} 