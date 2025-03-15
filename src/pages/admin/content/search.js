import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiExternalLink, FiCheck, FiPlus, FiLoader } from 'react-icons/fi';

// Admin components
import AdminLayout from '@/components/admin/AdminLayout';
import { verifyAdminTokenLocally } from '@/lib/firebase';

export default function SearchResults() {
    const router = useRouter();
    const { searchId, query } = router.query;

    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        total: 0
    });
    const [addingToLibrary, setAddingToLibrary] = useState({});

    useEffect(() => {
        // Check if logged in as admin
        const adminToken = localStorage.getItem('geobit_admin_token');
        if (!adminToken) {
            router.push('/admin');
            return;
        }

        if (verifyAdminTokenLocally(adminToken)) {
            // This means we're in development mode, generate some mock data
            if (searchId && query) {
                loadMockResults();
            }
        } else {
            // In production, we would fetch the actual search results
            // This is a placeholder for the real implementation
            if (searchId && query) {
                fetchSearchResults(searchId);
            }
        }
    }, [searchId, query, router]);

    const loadMockResults = () => {
        // Mock data for development
        setTimeout(() => {
            const mockResults = [
                {
                    id: '1',
                    title: 'New Research Suggests Earth's Inner Core Has Slowed Its Rotation',
          url: 'https://example.com/earth-inner-core-rotation',
                    source: 'Nature Geoscience',
                    date: '2023-07-15',
                    abstract: 'Researchers have found evidence that Earth's inner core has recently slowed down and may be rotating slower than the planet itself.This finding has implications for our understanding of the geodynamo and Earth's magnetic field generation.',
                    relevance: 92
                },
                {
                    id: '2',
                    title: 'Climate Model Predictions Underestimate Antarctic Ice Sheet Melt Rate',
                    url: 'https://example.com/antarctic-melt-rate',
                    source: 'Science',
                    date: '2023-08-02',
                    abstract: 'A new study comparing satellite observations with climate models suggests that most models underestimate the rate at which the Antarctic ice sheet is losing mass, raising concerns about future sea level rise projections.',
                    relevance: 88
                },
                {
                    id: '3',
                    title: 'Discovery of Rare Earth Elements in Deep-Sea Nodules Presents Mining Opportunities',
                    url: 'https://example.com/deep-sea-nodules',
                    source: 'Economic Geology',
                    date: '2023-07-28',
                    abstract: 'Researchers have identified significant concentrations of rare earth elements in deep-sea manganese nodules, offering potential new sources for these critical materials used in renewable energy technologies.',
                    relevance: 85
                },
                {
                    id: '4',
                    title: 'New Dating Technique Revises Timeline of Volcanic Eruptions in the Pacific Northwest',
                    url: 'https://example.com/volcano-dating-revision',
                    source: 'Journal of Volcanology and Geothermal Research',
                    date: '2023-06-29',
                    abstract: 'A novel radiometric dating approach has led to significant revisions in the chronology of volcanic eruptions in the Cascade Range, with implications for hazard assessment in the region.',
                    relevance: 79
                },
                {
                    id: '5',
                    title: 'Seismic Survey Reveals Previously Unknown Fault System Off California Coast',
                    url: 'https://example.com/california-fault-system',
                    source: 'Geology',
                    date: '2023-07-10',
                    abstract: 'High-resolution seafloor mapping has uncovered a complex network of previously unidentified fault lines off the southern California coast, potentially affecting earthquake hazard assessments for coastal communities.',
                    relevance: 81
                }
            ];

            setResults(mockResults);
            setPagination({
                currentPage: 1,
                totalPages: 3,
                total: 15
            });
            setLoading(false);
        }, 1000); // Simulate network delay
    };

    const fetchSearchResults = async (searchId) => {
        // In a real implementation, this would fetch the actual search results from the backend
        // This is just a placeholder
        setLoading(true);
        try {
            // Placeholder for actual API call
            // const response = await fetch(`/api/admin/search-results?searchId=${searchId}`);
            // const data = await response.json();

            // For now, just use mock data
            loadMockResults();
        } catch (error) {
            console.error('Error fetching search results:', error);
            toast.error('Failed to load search results');
            setLoading(false);
        }
    };

    const handleAddToLibrary = async (result) => {
        setAddingToLibrary(prev => ({ ...prev, [result.id]: true }));

        try {
            // In a real implementation, this would call your API to add the article to your library
            // This is just a placeholder
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call

            toast.success(`Added "${result.title}" to your content library`);

            // Mark as added in the UI
            setResults(prev =>
                prev.map(item =>
                    item.id === result.id ? { ...item, addedToLibrary: true } : item
                )
            );
        } catch (error) {
            console.error('Error adding to library:', error);
            toast.error('Failed to add article to library');
        } finally {
            setAddingToLibrary(prev => ({ ...prev, [result.id]: false }));
        }
    };

    const handleChangePage = (page) => {
        if (page < 1 || page > pagination.totalPages) return;

        // In a real implementation, this would fetch the results for the new page
        setLoading(true);

        // Simulate page change
        setTimeout(() => {
            setPagination(prev => ({
                ...prev,
                currentPage: page
            }));

            // In development, just reuse the same results but change their IDs
            setResults(prev => prev.map((item, index) => ({
                ...item,
                id: `${page}-${index + 1}`,
                addedToLibrary: false
            })));

            setLoading(false);
        }, 800);
    };

    return (
        <AdminLayout>
            <Head>
                <title>Search Results - GeoBit Admin</title>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="mb-6">
                <Link
                    href="/admin/dashboard"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
                >
                    <FiArrowLeft className="mr-2" /> Back to Dashboard
                </Link>

                <h1 className="text-2xl font-bold text-slate-800">
                    Search Results
                </h1>
                {query && (
                    <p className="text-slate-600">
                        Results for: <span className="font-medium">{query}</span>
                    </p>
                )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                {loading ? (
                    <div className="py-8 text-center">
                        <div className="inline-block animate-spin mr-2">
                            <FiLoader size={24} className="text-blue-600" />
                        </div>
                        <p className="text-slate-600 mt-2">Loading search results...</p>
                    </div>
                ) : results.length === 0 ? (
                    <div className="py-8 text-center">
                        <p className="text-slate-600">No results found for your search.</p>
                        <Link
                            href="/admin/dashboard"
                            className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition"
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="mb-4 flex justify-between items-center">
                            <p className="text-slate-600">
                                Showing {results.length} of {pagination.total} results
                            </p>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleChangePage(pagination.currentPage - 1)}
                                    disabled={pagination.currentPage <= 1}
                                    className="p-2 rounded-md bg-slate-200 text-slate-700 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <span className="text-slate-600">
                                    Page {pagination.currentPage} of {pagination.totalPages}
                                </span>
                                <button
                                    onClick={() => handleChangePage(pagination.currentPage + 1)}
                                    disabled={pagination.currentPage >= pagination.totalPages}
                                    className="p-2 rounded-md bg-slate-200 text-slate-700 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {results.map(result => (
                                <div
                                    key={result.id}
                                    className="border rounded-lg p-4 hover:bg-slate-50 transition"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-800">
                                                {result.title}
                                            </h3>
                                            <div className="flex items-center text-sm text-slate-500 mt-1 space-x-4">
                                                <span>{result.source}</span>
                                                <span>{result.date}</span>
                                                <span>Relevance: {result.relevance}%</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <a
                                                href={result.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-blue-600 hover:text-blue-800 mr-3"
                                            >
                                                <FiExternalLink className="mr-1" /> View Source
                                            </a>

                                            {result.addedToLibrary ? (
                                                <button
                                                    disabled
                                                    className="inline-flex items-center text-green-600 bg-green-100 px-3 py-1 rounded-md"
                                                >
                                                    <FiCheck className="mr-1" /> Added
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleAddToLibrary(result)}
                                                    disabled={addingToLibrary[result.id]}
                                                    className="inline-flex items-center text-slate-700 hover:text-slate-900 bg-slate-200 hover:bg-slate-300 px-3 py-1 rounded-md transition"
                                                >
                                                    {addingToLibrary[result.id] ? (
                                                        <>
                                                            <div className="animate-spin mr-1">
                                                                <FiLoader size={14} />
                                                            </div>
                                                            Adding...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FiPlus className="mr-1" /> Add to Library
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-slate-600 mt-3 text-sm">
                                        {result.abstract}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex justify-center">
                            <div className="flex items-center gap-2">
                                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => handleChangePage(page)}
                                        className={`w-8 h-8 flex items-center justify-center rounded-md ${pagination.currentPage === page
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
} 