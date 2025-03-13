import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { getNewsletters } from '@/lib/firebase';

// Admin components
import AdminLayout from '@/components/admin/AdminLayout';

export default function NewslettersPage() {
    const [newsletters, setNewsletters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Check if logged in
    useEffect(() => {
        const adminToken = localStorage.getItem('geobit_admin_token');
        if (!adminToken) {
            router.push('/admin');
            return;
        }

        fetchNewsletters(adminToken);
    }, [router]);

    const fetchNewsletters = async (token) => {
        setIsLoading(true);

        try {
            const result = await getNewsletters({ token });

            if (result.data.success) {
                setNewsletters(result.data.newsletters);
            } else {
                toast.error(result.data.error || 'Failed to load newsletters');
            }
        } catch (error) {
            console.error('Error fetching newsletters:', error);
            toast.error('Failed to load newsletters. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AdminLayout>
            <Head>
                <title>Newsletters - GeoBit Admin</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-800">
                    Newsletters
                </h1>
                <Link
                    href="/admin/dashboard"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                >
                    Back to Dashboard
                </Link>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500">Loading newsletters...</p>
                </div>
            ) : (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Title
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Published
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {newsletters.map((newsletter) => (
                                <tr key={newsletter.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {newsletter.title || `Newsletter ${newsletter.id}`}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${newsletter.status === 'published'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {newsletter.status === 'published' ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {newsletter.createdAt
                                            ? new Date(newsletter.createdAt.seconds * 1000).toLocaleDateString()
                                            : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {newsletter.publishedAt
                                            ? new Date(newsletter.publishedAt.seconds * 1000).toLocaleDateString()
                                            : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link
                                            href={`/admin/newsletters/edit/${newsletter.id}`}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                        >
                                            Edit
                                        </Link>
                                        {newsletter.status === 'published' && (
                                            <a
                                                href="#"
                                                className="text-blue-600 hover:text-blue-900"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    // View published newsletter
                                                    window.open(`/newsletter/${newsletter.id}`, '_blank');
                                                }}
                                            >
                                                View
                                            </a>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {newsletters.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                        No newsletters found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminLayout>
    );
} 