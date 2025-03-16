import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiFileText, FiSearch, FiCpu, FiFilter, FiPlus, FiExternalLink, FiEdit, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import AdminLayout from '../../../components/admin/AdminLayout';

export default function ContentManagement() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [contentItems, setContentItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    // Categories based on GeoBit Development Guidelines
    const categories = [
        { id: 'all', name: 'All Categories' },
        { id: 'hydrocarbon', name: 'Hydrocarbon & Energy' },
        { id: 'mining', name: 'Mining Resources' },
        { id: 'geopolitical', name: 'Geopolitical & Regional' },
        { id: 'academic', name: 'Academic & Research' }
    ];

    // Simulated content data for development
    useEffect(() => {
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
                {categories.find(c => c.id === category)?.name || category}
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

    return (
        <AdminLayout>
            <div className="space-y-6 overflow-y-auto pb-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-light">Content Management</h1>

                    <div className="flex items-center space-x-3">
                        <button
                            onClick={navigateToProcessContent}
                            className="flex items-center space-x-2 bg-dark-light hover:bg-dark-lighter text-primary py-2 px-4 rounded-md transition-colors"
                        >
                            <FiCpu />
                            <span>Process Content</span>
                        </button>

                        <button
                            onClick={navigateToSearchNews}
                            className="flex items-center space-x-2 bg-dark-light hover:bg-dark-lighter text-primary py-2 px-4 rounded-md transition-colors"
                        >
                            <FiSearch />
                            <span>Search News</span>
                        </button>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-dark-lighter border border-dark-border rounded-lg p-6 shadow-lg">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative w-full md:w-1/3">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="text-light-muted" />
                            </div>
                            <input
                                type="text"
                                className="bg-dark border border-dark-border text-light rounded-md block w-full pl-10 p-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder="Search content..."
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>

                        <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
                            <FiFilter className="text-light-muted mr-2" />
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryChange(category.id)}
                                    className={`whitespace-nowrap px-3 py-1.5 rounded-md ${selectedCategory === category.id
                                        ? 'bg-primary text-dark'
                                        : 'bg-dark-light text-light hover:bg-dark-lighter'
                                        }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content List */}
                <div className="bg-dark-lighter border border-dark-border rounded-lg shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-dark-border">
                            <thead className="bg-dark">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-light-muted uppercase tracking-wider">Title</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-light-muted uppercase tracking-wider">Categories</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-light-muted uppercase tracking-wider">Type</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-light-muted uppercase tracking-wider">Region</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-light-muted uppercase tracking-wider">Date</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-light-muted uppercase tracking-wider">Source</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-light-muted uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-dark-lighter divide-y divide-dark-border">
                                {currentItems.length > 0 ? (
                                    currentItems.map((item) => (
                                        <tr key={item.id} className="hover:bg-dark transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-light">{item.title}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-wrap gap-1">
                                                    {item.category.map(cat => (
                                                        <div key={cat} className="inline-block">
                                                            {renderCategoryBadge(cat)}
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-light-muted">{item.type}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-light-muted">{item.region}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-light-muted">{item.date}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-light-muted">{item.source}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(item.id)}
                                                        className="text-primary hover:text-primary-light"
                                                    >
                                                        <FiEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="text-red-500 hover:text-red-400"
                                                    >
                                                        <FiTrash2 />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4 text-center text-light">
                                            No content items found. Try adjusting your search or filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-dark-border">
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-light-muted">
                                    Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                                    <span className="font-medium">
                                        {indexOfLastItem > filteredItems.length ? filteredItems.length : indexOfLastItem}
                                    </span>{' '}
                                    of <span className="font-medium">{filteredItems.length}</span> results
                                </div>
                                <div className="flex space-x-1">
                                    <button
                                        onClick={() => handlePageChange(page - 1)}
                                        disabled={page === 1}
                                        className={`px-3 py-1 rounded ${page === 1
                                            ? 'bg-dark-light text-light-muted cursor-not-allowed'
                                            : 'bg-dark-light text-light hover:bg-dark-lighter'
                                            }`}
                                    >
                                        Previous
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`px-3 py-1 rounded ${page === pageNum
                                                ? 'bg-primary text-dark'
                                                : 'bg-dark-light text-light hover:bg-dark-lighter'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => handlePageChange(page + 1)}
                                        disabled={page === totalPages}
                                        className={`px-3 py-1 rounded ${page === totalPages
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
            </div>
        </AdminLayout>
    );
} 