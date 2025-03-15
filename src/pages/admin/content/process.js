import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiLoader, FiCpu, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

// Admin components
import AdminLayout from '@/components/admin/AdminLayout';
import { processArticleContent } from '@/lib/api';

export default function ProcessContent() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        url: '',
        title: '',
        content: ''
    });
    const [result, setResult] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.url || !formData.content) {
            toast.error('URL and content are required');
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const processResult = await processArticleContent({
                url: formData.url,
                title: formData.title || 'Article from URL',
                content: formData.content
            });

            if (processResult.success) {
                setResult(processResult.result);
                toast.success('Article processed successfully!');
            } else {
                throw new Error(processResult.error || 'Failed to process article');
            }
        } catch (error) {
            console.error('Error processing article:', error);
            toast.error(error.message || 'Failed to process article content');
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

            <div className="mb-6">
                <Link
                    href="/admin/dashboard"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
                >
                    <FiArrowLeft className="mr-2" /> Back to Dashboard
                </Link>

                <h1 className="text-2xl font-bold text-slate-800 flex items-center">
                    <FiCpu className="mr-2" /> Process Content with AI
                </h1>
                <p className="text-slate-600">
                    Enter article details below to generate AI summaries, categories, and interest ratings.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">
                        Article Details
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="url" className="block text-sm font-medium text-slate-700 mb-1">
                                Article URL *
                            </label>
                            <input
                                type="url"
                                id="url"
                                name="url"
                                value={formData.url}
                                onChange={handleChange}
                                placeholder="https://example.com/article"
                                required
                                className="w-full p-2 border border-slate-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                                Article Title (optional)
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Title will be extracted from content if not provided"
                                className="w-full p-2 border border-slate-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-1">
                                Article Content *
                            </label>
                            <textarea
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                placeholder="Paste the full article content here..."
                                required
                                rows={10}
                                className="w-full p-2 border border-slate-300 rounded-md font-mono text-sm"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 flex items-center"
                            >
                                {loading ? (
                                    <>
                                        <FiLoader className="animate-spin mr-2" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <FiCpu className="mr-2" />
                                        Process with AI
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">
                        Processing Results
                    </h2>

                    {loading ? (
                        <div className="py-8 text-center">
                            <div className="inline-block animate-spin mb-4">
                                <FiLoader size={32} className="text-purple-600" />
                            </div>
                            <p className="text-slate-600">
                                Processing article content with AI...
                            </p>
                            <p className="text-slate-500 text-sm mt-2">
                                This may take up to 30 seconds depending on article length.
                            </p>
                        </div>
                    ) : result ? (
                        <div className="space-y-6">
                            <div className="border-b pb-4">
                                <div className="flex items-center">
                                    <FiCheckCircle className="text-green-500 mr-2" size={20} />
                                    <h3 className="font-medium text-slate-800">Processing Complete</h3>
                                </div>
                                <p className="text-slate-600 text-sm mt-2">
                                    The article has been successfully processed with our AI models.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-medium text-slate-800 mb-2">Summary</h3>
                                <div className="bg-slate-50 p-3 rounded-md">
                                    <p className="text-slate-700">{result.summary}</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-medium text-slate-800 mb-2">Category</h3>
                                    <div className="bg-slate-50 p-3 rounded-md">
                                        <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
                                            {result.category}
                                        </span>
                                        {result.subCategories?.map((cat, index) => (
                                            <span key={index} className="inline-block bg-slate-100 text-slate-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-medium text-slate-800 mb-2">Interest Level</h3>
                                    <div className="bg-slate-50 p-3 rounded-md">
                                        <div className="flex items-center">
                                            <div className="w-full bg-slate-200 rounded-full h-4">
                                                <div
                                                    className={`h-4 rounded-full ${result.interestLevel > 75 ? 'bg-green-500' :
                                                            result.interestLevel > 50 ? 'bg-blue-500' :
                                                                result.interestLevel > 25 ? 'bg-amber-500' : 'bg-red-500'
                                                        }`}
                                                    style={{ width: `${result.interestLevel}%` }}
                                                ></div>
                                            </div>
                                            <span className="ml-2 font-medium">{result.interestLevel}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium text-slate-800 mb-2">Key Points</h3>
                                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                                    {result.keyPoints?.map((point, index) => (
                                        <li key={index}>{point}</li>
                                    )) || (
                                            <li>No key points extracted</li>
                                        )}
                                </ul>
                            </div>

                            <div className="pt-4 border-t mt-6">
                                <button
                                    onClick={handleSaveToLibrary}
                                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center"
                                >
                                    <FiCheckCircle className="mr-2" />
                                    Save to Content Library
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="py-8 text-center">
                            <FiAlertCircle size={32} className="text-slate-400 inline-block mb-4" />
                            <p className="text-slate-600">
                                Enter article details and click "Process with AI" to generate results.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
} 