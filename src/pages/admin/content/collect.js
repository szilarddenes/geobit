import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { toast } from 'react-toastify';
import { 
  collectContentFromSources,
  searchContentFromAI,
  getContentSources,
  verifyAdminTokenLocally 
} from '@/lib/firebase';
import AdminLayout from '@/components/admin/AdminLayout';
import { FiRss, FiSearch, FiRefreshCw, FiDatabase, FiCheckCircle, FiXCircle } from 'react-icons/fi';

export default function ContentCollectionPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [sources, setSources] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSources, setSelectedSources] = useState([]);
  const [searchCategories, setSearchCategories] = useState(['research', 'news']);
  const [resultsView, setResultsView] = useState('list'); // 'list' or 'grid'
  const router = useRouter();

  useEffect(() => {
    const adminToken = localStorage.getItem('geobit_admin_token');
    if (!adminToken) {
      router.push('/admin');
      return;
    }

    fetchSources();
  }, [router]);

  const fetchSources = async () => {
    try {
      const adminToken = localStorage.getItem('geobit_admin_token');
      const response = await getContentSources({ token: adminToken });
      
      if (response.data.success) {
        setSources(response.data.sources);
        // Select active sources by default
        setSelectedSources(response.data.sources.filter(s => s.active).map(s => s.id));
      } else {
        toast.error(response.data.error || 'Failed to fetch sources');
      }
    } catch (error) {
      console.error('Error fetching sources:', error);
      toast.error('Failed to fetch content sources');
    }
  };

  const handleCollectContent = async () => {
    if (isLoading) return;

    setIsLoading(true);
    toast.info('Collecting content from selected sources...');

    try {
      const adminToken = localStorage.getItem('geobit_admin_token');
      if (!adminToken) {
        toast.error('You must be logged in as an admin');
        router.push('/admin');
        return;
      }

      const sourcesToUse = sources.filter(source => selectedSources.includes(source.id));
      if (sourcesToUse.length === 0) {
        toast.warning('Please select at least one source');
        setIsLoading(false);
        return;
      }

      const result = await collectContentFromSources({
        token: adminToken,
        sourceIds: selectedSources
      });

      if (result.data.success) {
        toast.success(`Successfully collected ${result.data.contentCount} items from ${result.data.sources} sources`);
        // Could navigate to a content review page here
      } else {
        throw new Error(result.data.error || 'Failed to collect content');
      }
    } catch (error) {
      console.error('Error collecting content:', error);
      toast.error(error.message || 'Failed to collect content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAISearch = async (e) => {
    e.preventDefault();
    if (isSearching || !searchQuery.trim()) return;

    setIsSearching(true);
    toast.info('Searching for content using AI...');

    try {
      const adminToken = localStorage.getItem('geobit_admin_token');
      if (!adminToken) {
        toast.error('You must be logged in as an admin');
        router.push('/admin');
        return;
      }

      const result = await searchContentFromAI({
        token: adminToken,
        query: searchQuery,
        categories: searchCategories
      });

      if (result.data.success) {
        setSearchResults(result.data.content);
        toast.success(`Found ${result.data.content.length} articles matching your search`);
      } else {
        throw new Error(result.data.error || 'Failed to search for content');
      }
    } catch (error) {
      console.error('Error searching content:', error);
      toast.error(error.message || 'Failed to search for content');
    } finally {
      setIsSearching(false);
    }
  };

  const handleCategoryToggle = (category) => {
    if (searchCategories.includes(category)) {
      setSearchCategories(searchCategories.filter(c => c !== category));
    } else {
      setSearchCategories([...searchCategories, category]);
    }
  };

  const handleSelectAllSources = () => {
    if (selectedSources.length === sources.length) {
      setSelectedSources([]);
    } else {
      setSelectedSources(sources.map(s => s.id));
    }
  };

  const handleSelectSource = (sourceId) => {
    if (selectedSources.includes(sourceId)) {
      setSelectedSources(selectedSources.filter(id => id !== sourceId));
    } else {
      setSelectedSources([...selectedSources, sourceId]);
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Content Collection - GeoBit Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Content Collection</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setResultsView(resultView => resultView === 'list' ? 'grid' : 'list')}
            className="flex items-center gap-1 text-sm bg-slate-200 hover:bg-slate-300 text-slate-700 py-1 px-3 rounded-md transition"
          >
            {resultsView === 'list' ? 'Grid View' : 'List View'}
          </button>
          <button
            onClick={fetchSources}
            className="flex items-center gap-1 text-sm bg-slate-200 hover:bg-slate-300 text-slate-700 py-1 px-3 rounded-md transition"
          >
            <FiRefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Content Collection Panel */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
            <FiRss className="mr-2" /> Collect from Sources
          </h2>
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-slate-700">Select Sources</h3>
              <button
                onClick={handleSelectAllSources}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {selectedSources.length === sources.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-md divide-y">
              {sources.length === 0 ? (
                <div className="p-4 text-gray-500 text-center">No sources available</div>
              ) : (
                sources.map(source => (
                  <div 
                    key={source.id} 
                    className="p-3 flex items-center hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      id={`source-${source.id}`}
                      checked={selectedSources.includes(source.id)}
                      onChange={() => handleSelectSource(source.id)}
                      className="mr-3 h-4 w-4 rounded text-blue-600"
                    />
                    <label 
                      htmlFor={`source-${source.id}`}
                      className="flex-1 flex items-center justify-between cursor-pointer"
                    >
                      <span className="font-medium text-gray-700">{source.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        source.category === 'research' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {source.category}
                      </span>
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <button
            onClick={handleCollectContent}
            disabled={isLoading || selectedSources.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <FiRefreshCw className="mr-2 animate-spin" />
                Collecting...
              </>
            ) : (
              <>
                <FiDatabase className="mr-2" />
                Collect Content from Selected Sources
              </>
            )}
          </button>
        </div>

        {/* AI Search Panel */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
            <FiSearch className="mr-2" /> AI-Powered Search
          </h2>
          
          <form onSubmit={handleAISearch} className="space-y-4">
            <div>
              <label htmlFor="search-query" className="block font-medium text-gray-700 mb-1">
                Search Query
              </label>
              <input
                id="search-query"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="E.g., Latest research on glaciology"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                disabled={isSearching}
              />
            </div>
            
            <div>
              <span className="block font-medium text-gray-700 mb-1">Categories</span>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={searchCategories.includes('research')}
                    onChange={() => handleCategoryToggle('research')}
                    className="h-4 w-4 rounded text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Research</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={searchCategories.includes('news')}
                    onChange={() => handleCategoryToggle('news')}
                    className="h-4 w-4 rounded text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">News</span>
                </label>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim() || searchCategories.length === 0}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 flex items-center justify-center"
            >
              {isSearching ? (
                <>
                  <FiRefreshCw className="mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <FiSearch className="mr-2" />
                  Search
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Search Results</h2>
          
          {resultsView === 'list' ? (
            <div className="divide-y">
              {searchResults.map(result => (
                <div key={result.id} className="py-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900">{result.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      result.category === 'research' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {result.category}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2 text-sm">{result.summary}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">
                      {result.source} • {new Date(result.publishedAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center text-amber-600">
                        Interest Score: {result.interestScore}
                      </span>
                      <div className="flex gap-2">
                        <button className="flex items-center text-green-600 hover:text-green-800">
                          <FiCheckCircle size={18} />
                        </button>
                        <button className="flex items-center text-red-600 hover:text-red-800">
                          <FiXCircle size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map(result => (
                <div key={result.id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900">{result.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      result.category === 'research' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {result.category}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2 text-sm">{result.summary}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">
                      {result.source} • {new Date(result.publishedAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-600">
                        Score: {result.interestScore}
                      </span>
                      <div className="flex gap-2">
                        <button className="text-green-600 hover:text-green-800">
                          <FiCheckCircle size={16} />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <FiXCircle size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}