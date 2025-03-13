import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { 
  FiPlus, 
  FiRefreshCw, 
  FiEdit2, 
  FiTrash2, 
  FiFile, 
  FiSend, 
  FiCalendar, 
  FiSearch, 
  FiFilter 
} from 'react-icons/fi';
import { getNewsletters, generateNewsletterOnDemand, verifyAdminTokenLocally } from '@/lib/firebase';
import AdminLayout from '@/components/admin/AdminLayout';

export default function NewslettersPage() {
  const [newsletters, setNewsletters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const router = useRouter();

  useEffect(() => {
    const adminToken = localStorage.getItem('geobit_admin_token');
    if (!adminToken) {
      router.push('/admin');
      return;
    }

    fetchNewsletters();
  }, [router]);

  const fetchNewsletters = async () => {
    setIsLoading(true);
    try {
      const adminToken = localStorage.getItem('geobit_admin_token');
      const response = await getNewsletters({ 
        token: adminToken
      });

      if (response.data.success) {
        setNewsletters(response.data.newsletters);
      } else {
        toast.error(response.data.error || 'Failed to fetch newsletters');
      }
    } catch (error) {
      console.error('Error fetching newsletters:', error);
      
      // Development fallback
      const adminToken = localStorage.getItem('geobit_admin_token');
      if (verifyAdminTokenLocally(adminToken)) {
        // Mock newsletters for development
        const mockNewsletters = [
          {
            id: 'dev-news-1',
            title: 'Weekly Geoscience Update - March 10, 2025',
            status: 'published',
            createdAt: '2025-03-08T14:30:00Z',
            updatedAt: '2025-03-10T09:15:00Z',
            publishedAt: '2025-03-10T10:00:00Z',
          },
          {
            id: 'dev-news-2',
            title: 'Latest Research Highlights - March 5, 2025',
            status: 'published',
            createdAt: '2025-03-04T11:20:00Z',
            updatedAt: '2025-03-05T16:45:00Z',
            publishedAt: '2025-03-05T17:00:00Z',
          },
          {
            id: 'dev-news-3',
            title: 'Weekly Geoscience Update - March 3, 2025',
            status: 'published',
            createdAt: '2025-03-01T15:10:00Z',
            updatedAt: '2025-03-03T08:30:00Z',
            publishedAt: '2025-03-03T09:00:00Z',
          },
          {
            id: 'dev-news-4',
            title: 'Draft Newsletter - Coming Soon',
            status: 'draft',
            createdAt: '2025-03-12T10:00:00Z',
            updatedAt: '2025-03-12T11:30:00Z',
          }
        ];
        
        setNewsletters(mockNewsletters);
        toast.info('Using development mode with sample newsletter data');
      } else {
        toast.error('Failed to fetch newsletters');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateNewsletter = async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    toast.info('Generating new newsletter...');

    try {
      const adminToken = localStorage.getItem('geobit_admin_token');
      if (!adminToken) {
        toast.error('You must be logged in as an admin');
        router.push('/admin');
        return;
      }

      const result = await generateNewsletterOnDemand({
        token: adminToken
      });

      if (result.data.success) {
        toast.success('Newsletter generated successfully!');
        router.push(`/admin/newsletters/edit/${result.data.newsletterId}`);
      } else {
        throw new Error(result.data.error || 'Failed to generate newsletter');
      }
    } catch (error) {
      console.error('Error generating newsletter:', error);
      
      // Development fallback
      const adminToken = localStorage.getItem('geobit_admin_token');
      if (verifyAdminTokenLocally(adminToken)) {
        // Create a new mock newsletter
        const newId = 'dev-news-' + Date.now();
        const mockNewsletter = {
          id: newId,
          title: 'New Draft Newsletter',
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        setNewsletters([mockNewsletter, ...newsletters]);
        toast.success('Development mode: Newsletter generation simulated');
        router.push(`/admin/newsletters/edit/${newId}`);
      } else {
        toast.error(error.message || 'Failed to generate newsletter');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredNewsletters = newsletters
    .filter(newsletter => {
      // Filter by status
      if (statusFilter !== 'all' && newsletter.status !== statusFilter) {
        return false;
      }
      
      // Filter by search term
      if (searchTerm && !newsletter.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by selected field
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (!aValue && !bValue) return 0;
      if (!aValue) return sortOrder === 'asc' ? 1 : -1;
      if (!bValue) return sortOrder === 'asc' ? -1 : 1;
      
      // Compare dates or strings
      const comparison = new Date(aValue) > new Date(bValue) ? 1 : -1;
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  return (
    <AdminLayout>
      <Head>
        <title>Newsletters - GeoBit Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Newsletters</h1>
        <div className="flex space-x-3">
          <button
            onClick={fetchNewsletters}
            disabled={isLoading}
            className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 py-2 px-4 rounded-md transition"
          >
            <FiRefreshCw className={isLoading ? 'animate-spin' : ''} />
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
          
          <button
            onClick={handleGenerateNewsletter}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
          >
            <FiPlus />
            {isGenerating ? 'Generating...' : 'Generate New'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search newsletters..."
                className="pl-10 w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <FiFilter className="text-gray-400 mr-2" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <FiCalendar className="text-gray-400 mr-2" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="updatedAt">Last Updated</option>
                <option value="createdAt">Created Date</option>
                <option value="publishedAt">Published Date</option>
                <option value="title">Title</option>
              </select>
            </div>
            
            <button
              onClick={() => setSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-gray-300 rounded-md hover:bg-gray-100"
              title={sortOrder === 'asc' ? 'Ascending order' : 'Descending order'}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Newsletters list */}
      <div className="bg-white rounded-lg shadow-md">
        {isLoading ? (
          <div className="p-6 text-center">
            <FiRefreshCw className="inline-block animate-spin text-blue-600 mb-3" size={24} />
            <p className="text-gray-600">Loading newsletters...</p>
          </div>
        ) : filteredNewsletters.length === 0 ? (
          <div className="p-6 text-center">
            <FiFile className="inline-block text-gray-400 mb-3" size={24} />
            <p className="text-gray-600">No newsletters found with the current filters.</p>
            {searchTerm || statusFilter !== 'all' ? (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="mt-3 text-blue-600 hover:text-blue-800"
              >
                Clear filters
              </button>
            ) : (
              <button
                onClick={handleGenerateNewsletter}
                className="mt-3 text-blue-600 hover:text-blue-800"
              >
                Generate your first newsletter
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Published
                  </th>
                  <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredNewsletters.map(newsletter => (
                  <tr 
                    key={newsletter.id} 
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="py-4 px-4">
                      <Link 
                        href={`/admin/newsletters/edit/${newsletter.id}`}
                        className="font-medium text-gray-900 hover:text-blue-600"
                      >
                        {newsletter.title || 'Untitled Newsletter'}
                      </Link>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        newsletter.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {newsletter.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {new Date(newsletter.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {new Date(newsletter.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {newsletter.publishedAt 
                        ? new Date(newsletter.publishedAt).toLocaleDateString() 
                        : '-'}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/admin/newsletters/edit/${newsletter.id}`}
                          className="p-1 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
                          title="Edit newsletter"
                        >
                          <FiEdit2 size={18} />
                        </Link>
                        
                        {newsletter.status !== 'published' && (
                          <button
                            className="p-1 text-green-600 hover:text-green-800 rounded-full hover:bg-green-50"
                            title="Publish newsletter"
                          >
                            <FiSend size={18} />
                          </button>
                        )}
                        
                        <button
                          className="p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50"
                          title="Delete newsletter"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}