import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiFileText, FiSearch, FiCpu, FiFilter, FiPlus, FiExternalLink, FiEdit, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import AdminLayout from '../../../components/admin/AdminLayout';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaFilter } from 'react-icons/fa';
import { verifyAdminTokenLocally } from '../../../lib/firebase';
import withAdminAuth from '@/components/admin/withAdminAuth';

function ContentManagement() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [contentItems, setContentItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showMobile, setShowMobile] = useState(false);
    const itemsPerPage = 10;

    // Categories based on GeoBit Development Guidelines
    const categories = [
        { id: 'all', name: 'All Categories' },
        { id: 'hydrocarbon', name: 'Hydrocarbon & Energy' },
        { id: 'mining', name: 'Mining Resources' },
        { id: 'geopolitical', name: 'Geopolitical & Regional' },
        { id: 'academic', name: 'Academic & Research' }
    ];

    // Add admin verification similar to other admin pages
    useEffect(() => {
        // In development mode, bypass admin check
        if (process.env.NODE_ENV === 'development') {
            console.log("Development mode: bypassing strict admin check");
            // Continue loading the page content
            loadContentItems();
            return;
        }

        const checkAdminStatus = async () => {
            try {
                const isAdmin = await verifyAdminTokenLocally();
                if (!isAdmin) {
                    console.log("Not authorized as admin, redirecting");
                    router.push('/admin/login');
                    return;
                }

                // User is admin, load content
                loadContentItems();
            } catch (error) {
                console.error("Admin verification error:", error);
                router.push('/admin/login');
            }
        };

        checkAdminStatus();
    }, [router]);

    const loadContentItems = () => {
        // This function loads the mock content items
        const mockContent = Array(25).fill().map((_, i) => ({
            id: `content-${i + 1}`,
            title: `${getRandomTitle(i)}`,
            summary: `Summary of geological findings related to ${getRandomTopic()}. Limited to 100 words as per guidelines.`,
            category: getRandomCategory(),
            type: getRandomType(),
            region: getRandomRegion(),
            date: getRandomDate(),
            source: getRandomSource()
        }));

        setContentItems(mockContent);
        setIsLoading(false);
    };

    // Check viewport size
    useEffect(() => {
        const checkIfMobile = () => {
            setShowMobile(window.innerWidth < 1024);
        };

        // Initial check
        checkIfMobile();

        // Add event listener
        window.addEventListener('resize', checkIfMobile);

        // Cleanup
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    // Filter content when search term or category changes
    useEffect(() => {
        let filtered = [...contentItems];

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.summary.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(item =>
                item.category.includes(selectedCategory)
            );
        }

        setFilteredItems(filtered);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        setPage(1); // Reset to first page when filters change
    }, [searchTerm, selectedCategory, contentItems]);

    // Helper functions for mock data
    function getRandomTitle(index) {
        const titles = [
            "Recent Discoveries in Shale Gas Extraction Methods",
            "Advances in Subsurface Mapping Technologies",
            "Climate Impact on Mineral Resource Accessibility",
            "Deep Sea Mining Potential in the Pacific",
            "Geological Formations Surrounding Active Volcanoes",
            "Renewable Energy Integration with Traditional Resource Extraction",
            "Satellite Imagery Applications in Resource Management",
            "Urban Mining: Reclaiming Minerals from Industrial Waste",
            "Water Management Techniques in Arid Mining Regions",
            "Carbonate Formation Studies in Equatorial Regions"
        ];
        return titles[index % titles.length];
    }

    function getRandomTopic() {
        const topics = ["mineral deposits", "groundwater systems", "tectonic plate movement",
            "volcanic activity", "fossil fuel reserves", "soil composition", "geological mapping"];
        return topics[Math.floor(Math.random() * topics.length)];
    }

    function getRandomCategory() {
        const cats = [['hydrocarbon'], ['mining'], ['geopolitical'], ['academic'],
        ['hydrocarbon', 'geopolitical'], ['mining', 'academic'], ['academic', 'geopolitical']];
        return cats[Math.floor(Math.random() * cats.length)];
    }

    function getRandomType() {
        const types = ["academic", "industry", "government", "educational"];
        return types[Math.floor(Math.random() * types.length)];
    }

    function getRandomRegion() {
        const regions = ["North America", "South America", "Europe", "Asia", "Middle East", "Africa", "Australia"];
        return regions[Math.floor(Math.random() * regions.length)];
    }

    function getRandomDate() {
        const start = new Date(2022, 0, 1);
        const end = new Date();
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
    }

    function getRandomSource() {
        const sources = [
            "Nature Earth", "Mining Journal", "Oil & Gas Journal", "USGS",
            "Resource World", "Geopolitical Futures", "Science Magazine"
        ];
        return sources[Math.floor(Math.random() * sources.length)];
    }

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const navigateToProcessContent = () => {
        router.push('/admin/content/process');
    };

    const navigateToSearchNews = () => {
        router.push('/admin/content/search');
    };

    const handleEdit = (id) => {
        // In a real app, this would navigate to an edit page
        toast.success(`Editing content: ${id}`);
    };

    const handleDelete = (id) => {
        // In a real app, this would call a delete API
        toast.success(`Content deleted: ${id}`);
        setContentItems(prev => prev.filter(item => item.id !== id));
    };

    // Calculate pagination
    const indexOfLastItem = page * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    // Render category badge
    const renderCategoryBadge = (category) => {
        const colors = {
            hydrocarbon: 'bg-blue-600',
            mining: 'bg-amber-600',
            geopolitical: 'bg-red-600',
            academic: 'bg-green-600'
        };

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[category] || 'bg-gray-600'} text-white`}>
                {categories.find(c => c.id === category)?.name.split(' ')[0] || category}
            </span>
        );
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </AdminLayout>
        );
    }

    // Mobile card view
    const MobileView = () => (
        <div className="space-y-4">
            {currentItems.length > 0 ? (
                currentItems.map((item) => (
                    <div key={item.id} className="bg-dark p-4 rounded-lg border border-dark-border">
                        <div className="flex justify-between mb-2">
                            <h3 className="font-medium text-light">{item.title}</h3>
                            <div className="flex space-x-2">
                                <button onClick={() => handleEdit(item.id)} className="text-primary">
                                    <FiEdit size={18} />
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="text-red-500">
                                    <FiTrash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-2">
                            {item.category.map(cat => (
                                <div key={cat} className="inline-block">
                                    {renderCategoryBadge(cat)}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm text-light-muted">
                            <div>
                                <span className="font-medium">Type:</span> {item.type}
                            </div>
                            <div>
                                <span className="font-medium">Region:</span> {item.region}
                            </div>
                            <div>
                                <span className="font-medium">Date:</span> {item.date}
                            </div>
                            <div>
                                <span className="font-medium">Source:</span> {item.source}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-8 text-light-muted">
                    No content items found. Try adjusting your search or filters.
                </div>
            )}
        </div>
    );

    return (
        <AdminLayout>
            <div className="h-full flex flex-col overflow-hidden">
                <div className="px-4 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <h1 className="text-2xl font-semibold text-gray-900">Content Management</h1>
                    <Link
                        href="/admin/content/create"
                        className="mt-2 sm:mt-0 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <FaPlus className="mr-2" size={14} />
                        Add Content
                    </Link>
                </div>

                <div className="p-4 bg-gray-50 border-t border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" size={14} />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Search content..."
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                        <div className="w-full sm:w-48">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaFilter className="text-gray-400" size={14} />
                                </div>
                                <select
                                    className="block w-full pl-10 pr-3 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    value={selectedCategory}
                                    onChange={(e) => handleCategoryChange(e.target.value)}
                                >
                                    <option value="all">All Types</option>
                                    <option value="hydrocarbon">Hydrocarbon & Energy</option>
                                    <option value="mining">Mining Resources</option>
                                    <option value="geopolitical">Geopolitical & Regional</option>
                                    <option value="academic">Academic & Research</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden p-4">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col">
                            {showMobile ? <MobileView /> : (
                                <div className="h-full flex flex-col">
                                    <div className="overflow-auto flex-grow">
                                        <table className="min-w-full divide-y divide-dark-border">
                                            <thead className="bg-dark">
                                                <tr>
                                                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-light-muted uppercase tracking-wider">Title</th>
                                                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-light-muted uppercase tracking-wider">Categories</th>
                                                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-light-muted uppercase tracking-wider">Type</th>
                                                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-light-muted uppercase tracking-wider">Region</th>
                                                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-light-muted uppercase tracking-wider">Date</th>
                                                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-light-muted uppercase tracking-wider">Source</th>
                                                    <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-light-muted uppercase tracking-wider w-20">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-dark-lighter divide-y divide-dark-border">
                                                {currentItems.length > 0 ? (
                                                    currentItems.map((item) => (
                                                        <tr key={item.id} className="hover:bg-dark transition-colors">
                                                            <td className="px-3 py-2 whitespace-nowrap">
                                                                <div className="text-xs sm:text-sm font-medium text-light">{item.title}</div>
                                                            </td>
                                                            <td className="px-3 py-2 whitespace-nowrap">
                                                                <div className="flex flex-wrap gap-1">
                                                                    {item.category.map(cat => (
                                                                        <div key={cat} className="inline-block">
                                                                            {renderCategoryBadge(cat)}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </td>
                                                            <td className="px-3 py-2 whitespace-nowrap">
                                                                <div className="text-xs sm:text-sm text-light-muted">{item.type}</div>
                                                            </td>
                                                            <td className="px-3 py-2 whitespace-nowrap">
                                                                <div className="text-xs sm:text-sm text-light-muted">{item.region}</div>
                                                            </td>
                                                            <td className="px-3 py-2 whitespace-nowrap">
                                                                <div className="text-xs sm:text-sm text-light-muted">{item.date}</div>
                                                            </td>
                                                            <td className="px-3 py-2 whitespace-nowrap">
                                                                <div className="text-xs sm:text-sm text-light-muted">{item.source}</div>
                                                            </td>
                                                            <td className="px-3 py-2 whitespace-nowrap text-right">
                                                                <div className="flex justify-end space-x-2">
                                                                    <button
                                                                        onClick={() => handleEdit(item.id)}
                                                                        className="text-primary hover:text-primary-light"
                                                                    >
                                                                        <FiEdit size={16} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDelete(item.id)}
                                                                        className="text-red-500 hover:text-red-400"
                                                                    >
                                                                        <FiTrash2 size={16} />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="7" className="px-3 py-4 text-center text-light">
                                                            No content items found. Try adjusting your search or filters.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="px-3 py-2 border-t border-dark-border mt-auto">
                                            <div className="flex flex-col sm:flex-row justify-between items-center">
                                                <div className="text-xs text-light-muted mb-2 sm:mb-0">
                                                    {indexOfFirstItem + 1}-{indexOfLastItem > filteredItems.length ? filteredItems.length : indexOfLastItem} of {filteredItems.length}
                                                </div>
                                                <div className="flex space-x-1">
                                                    <button
                                                        onClick={() => handlePageChange(page - 1)}
                                                        disabled={page === 1}
                                                        className={`px-2 py-1 text-xs rounded ${page === 1
                                                            ? 'bg-dark-light text-light-muted cursor-not-allowed'
                                                            : 'bg-dark-light text-light hover:bg-dark-lighter'
                                                            }`}
                                                    >
                                                        Prev
                                                    </button>
                                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                                        // Calculate page numbers to show (max 5)
                                                        let pageNum;
                                                        if (totalPages <= 5) {
                                                            pageNum = i + 1;
                                                        } else if (page <= 3) {
                                                            pageNum = i + 1;
                                                        } else if (page >= totalPages - 2) {
                                                            pageNum = totalPages - 4 + i;
                                                        } else {
                                                            pageNum = page - 2 + i;
                                                        }

                                                        return (
                                                            <button
                                                                key={pageNum}
                                                                onClick={() => handlePageChange(pageNum)}
                                                                className={`px-2 py-1 text-xs rounded ${page === pageNum
                                                                    ? 'bg-primary text-dark'
                                                                    : 'bg-dark-light text-light hover:bg-dark-lighter'
                                                                    }`}
                                                            >
                                                                {pageNum}
                                                            </button>
                                                        );
                                                    })}
                                                    <button
                                                        onClick={() => handlePageChange(page + 1)}
                                                        disabled={page === totalPages}
                                                        className={`px-2 py-1 text-xs rounded ${page === totalPages
                                                            ? 'bg-dark-light text-light-muted cursor-not-allowed'
                                                            : 'bg-dark-light text-light hover:bg-dark-lighter'
                                                            }`}
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

export default withAdminAuth(ContentManagement); 