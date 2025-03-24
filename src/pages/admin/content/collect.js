import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { toast } from 'react-toastify';
import {
  collectContentFromSources,
  searchContentFromAI,
  getContentSources
} from '@/lib/firebase';
import AdminLayout from '@/components/admin/AdminLayout';
import { FiRss, FiSearch, FiRefreshCw, FiDatabase, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import withAdminAuth from '@/components/admin/withAdminAuth';

function CollectContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [sources, setSources] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSources, setSelectedSources] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    try {
      const sourcesData = await getContentSources();
      if (sourcesData.success) {
        setSources(sourcesData.sources || []);
      } else {
        toast.error(sourcesData.error || 'Failed to load content sources');
      }
    } catch (error) {
      console.error('Error fetching sources:', error);
      toast.error('Failed to load content sources');
    }
  };

  const handleCollectContent = async () => {
    if (selectedSources.length === 0) {
      toast.error('Please select at least one source');
      return;
    }

    try {
      setIsLoading(true);
      const result = await collectContentFromSources(selectedSources);

      if (result.success) {
        toast.success(
          `Successfully collected ${result.collected} items from ${result.sourcesProcessed} sources`
        );

        // If content was collected, redirect to content management
        if (result.collected > 0) {
          router.push('/admin/content');
        }
      } else {
        toast.error(result.error || 'Failed to collect content');
      }
    } catch (error) {
      console.error('Error collecting content:', error);
      toast.error('Failed to collect content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAISearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    try {
      setIsSearching(true);
      const result = await searchContentFromAI(searchQuery);

      if (result.success) {
        setSearchResults(result.results || []);
        if (result.results.length === 0) {
          toast.info('No results found for your query');
        } else {
          toast.success(`Found ${result.results.length} results`);
        }
      } else {
        toast.error(result.error || 'Search failed');
      }
    } catch (error) {
      console.error('Error searching content:', error);
      toast.error('Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  const handleCategoryToggle = (category) => {
    const sourcesInCategory = sources.filter(source => source.category === category).map(source => source.id);
    const allSelected = sourcesInCategory.every(id => selectedSources.includes(id));

    if (allSelected) {
      setSelectedSources(selectedSources.filter(id => !sourcesInCategory.includes(id)));
    } else {
      setSelectedSources([...new Set([...selectedSources, ...sourcesInCategory])]);
    }
  };

  const handleSelectAllSources = () => {
    if (selectedSources.length === sources.length) {
      setSelectedSources([]);
    } else {
      setSelectedSources(sources.map(source => source.id));
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
    <AdminLayout title="Collect Content">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Collection</h1>
          <p className="text-gray-600">
            Collect content from configured sources or search for specific topics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sources Collection Panel */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <FiRss className="mr-2 text-blue-500" />
                Content Sources
              </h2>
              <button
                onClick={handleSelectAllSources}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {selectedSources.length === sources.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            {sources.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No content sources configured
              </div>
            ) : (
              <div className="space-y-6">
                {/* Research Sources */}
                <div>
                  <div
                    className="flex items-center justify-between cursor-pointer mb-2"
                    onClick={() => handleCategoryToggle('research')}
                  >
                    <h3 className="font-medium text-gray-700 flex items-center">
                      <span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
                      Research Sources
                    </h3>
                    <span className="text-sm text-gray-500">
                      {sources.filter(s => s.category === 'research').length} sources
                    </span>
                  </div>

                  <div className="space-y-2 ml-5">
                    {sources
                      .filter(source => source.category === 'research')
                      .map(source => (
                        <div
                          key={source.id}
                          className="flex items-center justify-between p-2 rounded hover:bg-gray-50"
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`source-${source.id}`}
                              checked={selectedSources.includes(source.id)}
                              onChange={() => handleSelectSource(source.id)}
                              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <label
                              htmlFor={`source-${source.id}`}
                              className="ml-2 cursor-pointer flex items-center"
                            >
                              <span className="font-medium text-gray-700">{source.name}</span>
                              <span className={`text-xs px-2 py-1 rounded-full ${source.category === 'research'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-blue-100 text-blue-800'
                                } ml-2`}>
                                {source.type}
                              </span>
                            </label>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* News Sources */}
                <div>
                  <div
                    className="flex items-center justify-between cursor-pointer mb-2"
                    onClick={() => handleCategoryToggle('news')}
                  >
                    <h3 className="font-medium text-gray-700 flex items-center">
                      <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                      News Sources
                    </h3>
                    <span className="text-sm text-gray-500">
                      {sources.filter(s => s.category === 'news').length} sources
                    </span>
                  </div>

                  <div className="space-y-2 ml-5">
                    {sources
                      .filter(source => source.category === 'news')
                      .map(source => (
                        <div
                          key={source.id}
                          className="flex items-center justify-between p-2 rounded hover:bg-gray-50"
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`source-${source.id}`}
                              checked={selectedSources.includes(source.id)}
                              onChange={() => handleSelectSource(source.id)}
                              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <label
                              htmlFor={`source-${source.id}`}
                              className="ml-2 cursor-pointer flex items-center"
                            >
                              <span className="font-medium text-gray-700">{source.name}</span>
                              <span className={`text-xs px-2 py-1 rounded-full ${source.category === 'research'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-blue-100 text-blue-800'
                                } ml-2`}>
                                {source.type}
                              </span>
                            </label>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={handleCollectContent}
                disabled={isLoading || selectedSources.length === 0}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <FiRefreshCw className="animate-spin mr-2" />
                    Collecting...
                  </>
                ) : (
                  <>
                    <FiDatabase className="mr-2" />
                    Collect Content
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Search Panel */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <FiSearch className="mr-2 text-blue-500" />
              AI-Powered Search
            </h2>

            <form onSubmit={handleAISearch} className="mb-6">
              <div className="flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for specific topics or content..."
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                  disabled={isSearching}
                />
                <button
                  type="submit"
                  disabled={isSearching || !searchQuery.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {isSearching ? (
                    <FiRefreshCw className="animate-spin" />
                  ) : (
                    <FiSearch />
                  )}
                </button>
              </div>
            </form>

            {/* Search Results */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {isSearching ? (
                <div className="text-center py-8">
                  <FiRefreshCw className="animate-spin mx-auto h-8 w-8 text-blue-500" />
                  <p className="mt-2 text-gray-600">Searching...</p>
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((result, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-md hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900">{result.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${result.category === 'research'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                        }`}>
                        {result.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{result.description}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{result.source}</span>
                      <span>{new Date(result.date).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-3 flex justify-end space-x-2">
                      <button
                        onClick={() => window.open(result.url, '_blank')}
                        className="text-xs px-2 py-1 text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <FiExternalLink className="mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => {
                          // Add to collection logic
                          toast.success('Added to collection');
                        }}
                        className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 flex items-center"
                      >
                        <FiCheckCircle className="mr-1" />
                        Add
                      </button>
                    </div>
                  </div>
                ))
              ) : searchQuery ? (
                <div className="text-center py-8 text-gray-500">
                  No results found for "{searchQuery}"
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Enter a search query to find relevant content
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAdminAuth(CollectContent);