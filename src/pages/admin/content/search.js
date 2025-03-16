import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { FiSearch, FiCalendar, FiLink, FiExternalLink, FiCpu, FiAlertTriangle } from 'react-icons/fi';
import { BiHash } from 'react-icons/bi';
import Head from 'next/head';
import { useRouter } from 'next/router';
import api from '../../../lib/api';

export default function SearchNews() {
  const [searchParams, setSearchParams] = useState({
    keywords: '',
    dateRange: '7d', // 1d, 7d, 30d, 90d
    sources: [],
    page: 1,
    limit: 10
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  const sourceOptions = [
    { value: 'scientific_journals', label: 'Scientific Journals' },
    { value: 'news', label: 'News Outlets' },
    { value: 'universities', label: 'Universities' },
    { value: 'government', label: 'Government' },
    { value: 'industry', label: 'Industry Publications' }
  ];

  const handleSourceToggle = (value) => {
    setSearchParams(prev => {
      if (prev.sources.includes(value)) {
        return { ...prev, sources: prev.sources.filter(s => s !== value) };
      } else {
        return { ...prev, sources: [...prev.sources, value] };
      }
    });
  };

  const searchNewContent = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!searchParams.keywords?.trim()) {
        throw new Error('Keywords are required for search');
      }

      // Create date range object
      let dateRangeObj = {};
      if (searchParams.dateRange) {
        const now = new Date();
        let startDate = new Date();

        if (searchParams.dateRange === '1d') {
          startDate.setDate(now.getDate() - 1);
        } else if (searchParams.dateRange === '7d') {
          startDate.setDate(now.getDate() - 7);
        } else if (searchParams.dateRange === '30d') {
          startDate.setDate(now.getDate() - 30);
        } else if (searchParams.dateRange === '90d') {
          startDate.setDate(now.getDate() - 90);
        }

        dateRangeObj = {
          startDate: startDate.toISOString(),
          endDate: now.toISOString()
        };
      }

      // Clean params
      const cleanParams = {
        keywords: searchParams.keywords.trim(),
        dateRange: dateRangeObj,
        sources: searchParams.sources?.length ? searchParams.sources : [],
        page: searchParams.page || 1,
        limit: 10
      };

      console.log('Calling searchGeoscienceNews with params:', cleanParams);

      const response = await api.ai.searchGeoscienceNews(cleanParams);

      if (response?.success) {
        // Ensure we have a results property even if response doesn't include one
        const resultsData = {
          ...response.data,
          results: response.data?.results || []
        };
        setResults(resultsData);
      } else {
        throw new Error(response?.error || 'Failed to search for news');
      }
    } catch (err) {
      console.error('Search error:', err);
      // Handle the circular structure error specifically
      if (err.message && err.message.includes('Converting circular structure to JSON')) {
        setError('An error occurred with the search request. Please try different keywords or contact support.');
      } else {
        setError(err.message || 'An error occurred while searching');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleNextPage = () => {
    setSearchParams(prev => ({
      ...prev,
      page: (prev.page || 1) + 1
    }));
  };

  const handlePrevPage = () => {
    setSearchParams(prev => ({
      ...prev,
      page: Math.max((prev.page || 1) - 1, 1)
    }));
  };

  useEffect(() => {
    // Only search when parameters other than keywords change
    // Or if we have keywords and the page changes
    const shouldSearch = searchParams.keywords.trim() && (
      searchParams.page > 1 ||
      searchParams.dateRange !== '7d' ||
      searchParams.sources.length > 0
    );

    if (shouldSearch) {
      searchNewContent();
    }
  }, [searchParams]);

  // Add a debounced search for when keywords change
  useEffect(() => {
    // Don't search if the keywords are empty
    if (!searchParams.keywords.trim()) return;

    // Set a timeout to avoid searching on every keystroke
    const timer = setTimeout(() => {
      searchNewContent();
    }, 1000); // Wait 1 second after typing stops

    // Clear the timeout if the component unmounts or keywords change again
    return () => clearTimeout(timer);
  }, [searchParams.keywords]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-light">Search Geoscience News</h1>
          <div className="flex items-center text-light-muted bg-dark-lighter px-3 py-1 rounded-md">
            <FiCpu className="mr-2" />
            <span>AI-Powered Search</span>
          </div>
        </div>

        <div className="bg-dark-lighter border border-dark-border rounded-lg p-6 shadow-lg">
          <form onSubmit={searchNewContent} className="space-y-4">
            <div>
              <label htmlFor="keywords" className="block text-light mb-1 font-medium">
                Search Keywords
              </label>
              <input
                type="text"
                id="keywords"
                className="w-full p-2 rounded bg-dark border border-dark-border text-light focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., lithium mining, geothermal energy, earthquake prediction"
                value={searchParams.keywords}
                onChange={e => setSearchParams({ ...searchParams, keywords: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-light mb-1 font-medium">
                  Date Range
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { value: '1d', label: 'Last 24h' },
                    { value: '7d', label: 'Last 7 days' },
                    { value: '30d', label: 'Last 30 days' },
                    { value: '90d', label: 'Last 90 days' }
                  ].map(option => (
                    <button
                      key={option.value}
                      type="button"
                      className={`p-2 rounded text-center text-sm ${searchParams.dateRange === option.value
                        ? 'bg-primary text-dark font-bold'
                        : 'bg-dark text-light-muted hover:bg-dark-light'
                        }`}
                      onClick={() => setSearchParams({ ...searchParams, dateRange: option.value })}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-light mb-1 font-medium">
                  Sources
                </label>
                <div className="flex flex-wrap gap-2">
                  {sourceOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      className={`px-3 py-1 rounded text-sm ${searchParams.sources.includes(option.value)
                        ? 'bg-primary text-dark font-bold'
                        : 'bg-dark text-light-muted hover:bg-dark-light'
                        }`}
                      onClick={() => handleSourceToggle(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
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
                    Searching...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <FiSearch className="mr-2" />
                    Search News
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

          {results && (
            <div className="mt-6">
              <div className="mb-4 p-3 bg-dark rounded-lg text-light-muted text-sm">
                Found {results.totalResults} results for "{results.searchMetadata?.query}" in {results.searchMetadata?.processingTime || '~1 second'}.
                {results.searchMetadata?.sources && (
                  <span> Sources: {Array.isArray(results.searchMetadata?.sources)
                    ? results.searchMetadata?.sources.join(', ')
                    : results.searchMetadata?.sources}
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {results.results?.map((item, index) => (
                  <div key={index} className="p-4 bg-dark-light rounded-lg hover:bg-dark-light/80 transition-colors">
                    <h3 className="text-light font-bold mb-2">
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary">
                        {item.title}
                        <FiExternalLink className="text-light-muted" />
                      </a>
                    </h3>

                    <div className="flex items-center text-sm text-light-muted mb-2">
                      <span className="flex items-center">
                        <FiCalendar className="mr-1" />
                        {formatDate(item.date)}
                      </span>
                      <span className="mx-2">•</span>
                      <span>{item.source}</span>
                      {item.category && (
                        <>
                          <span className="mx-2">•</span>
                          <span className="bg-dark-border px-2 py-0.5 rounded-full text-xs">
                            {item.category}
                          </span>
                        </>
                      )}
                    </div>

                    <p className="text-light">{item.summary}</p>

                    <div className="mt-3 flex gap-2 flex-wrap">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm flex items-center text-primary hover:underline"
                      >
                        <FiLink className="mr-1" />
                        Visit Source
                      </a>
                      <button
                        onClick={() => {
                          setFormData({
                            url: item.url,
                            title: item.title,
                            content: item.summary
                          });
                          router.push('/admin/content/process');
                        }}
                        className="text-sm flex items-center text-primary hover:underline"
                      >
                        <FiCpu className="mr-1" />
                        Process Full Article
                      </button>
                    </div>
                  </div>
                ))}

                {(!results.results || results.results.length === 0) && (
                  <div className="p-6 bg-dark-light rounded-lg text-center">
                    <p className="text-light-muted">No results found. Try different keywords or filters.</p>
                  </div>
                )}
              </div>

              {results.pagination?.totalPages > 1 && (
                <div className="mt-6 flex justify-between items-center">
                  <button
                    onClick={handlePrevPage}
                    disabled={results.pagination?.page === 1 || loading}
                    className="px-4 py-2 bg-dark-light text-light rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <span className="text-light-muted">
                    Page {results.pagination?.page} of {results.pagination?.totalPages}
                  </span>

                  <button
                    onClick={handleNextPage}
                    disabled={results.pagination?.page === results.pagination?.totalPages || loading}
                    className="px-4 py-2 bg-dark-light text-light rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}

              <div className="mt-6 bg-dark-border/20 p-4 rounded-lg text-light-muted text-sm">
                <div className="mb-2 flex items-center">
                  <FiSearch className="mr-2" />
                  <strong>Search Query:</strong>
                  <span className="ml-2">{results.query || searchParams.keywords}</span>
                </div>
                {results.searchMetadata && (
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <div>
                      <strong>Processing Time:</strong> {results.searchMetadata.processingTime}
                    </div>
                    <div>
                      <strong>Sources:</strong> {typeof results.searchMetadata.sources === 'string'
                        ? results.searchMetadata.sources
                        : (results.searchMetadata.sources?.join(', ') || 'All sources')}
                    </div>
                    <div>
                      <strong>Date Range:</strong> {results.searchMetadata.dateRange || searchParams.dateRange}
                    </div>
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