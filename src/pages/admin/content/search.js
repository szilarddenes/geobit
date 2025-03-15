import { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { FiSearch, FiCalendar, FiLink, FiExternalLink, FiCpu, FiAlertTriangle } from 'react-icons/fi';
import { searchGeoscienceNews } from '../../../lib/api/ai';

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

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate input
      if (!searchParams.keywords.trim()) {
        throw new Error('Keywords are required');
      }

      const results = await searchGeoscienceNews({
        keywords: searchParams.keywords,
        dateRange: searchParams.dateRange,
        sources: searchParams.sources.length > 0 ? searchParams.sources : undefined,
        page: searchParams.page,
        limit: searchParams.limit
      });

      setResults(results);
    } catch (err) {
      console.error('Error searching geoscience news:', err);
      setError(err.message || 'Error searching for news');
      
      // In development mode, provide sample response
      if (process.env.NODE_ENV === 'development') {
        setTimeout(() => {
          setResults({
            items: [
              {
                title: 'New Lithium Deposits Discovered in Nevada Basin',
                url: 'https://example.com/lithium-nevada',
                source: 'Geology Today',
                date: '2023-05-15',
                snippet: 'Researchers have discovered significant lithium deposits in Nevada\'s Clayton Valley, potentially increasing US domestic supply of this critical mineral used in batteries and clean energy technology.',
                relevance: 0.95
              },
              {
                title: 'Advanced Seismic Techniques Reveal Hidden Fault Lines',
                url: 'https://example.com/seismic-fault-lines',
                source: 'Earthquake Research Journal',
                date: '2023-05-10',
                snippet: 'Using novel seismic imaging techniques, scientists have identified previously unknown fault lines beneath major California urban centers, improving earthquake risk assessment models.',
                relevance: 0.88
              },
              {
                title: 'Climate Change Impacts on Groundwater Systems',
                url: 'https://example.com/climate-groundwater',
                source: 'Hydrology Reports',
                date: '2023-05-05',
                snippet: 'A comprehensive study shows how rising temperatures and changing precipitation patterns are affecting groundwater recharge rates across western North America.',
                relevance: 0.82
              }
            ],
            totalResults: 24,
            page: 1,
            totalPages: 3,
            searchMetadata: {
              query: searchParams.keywords,
              processingTime: '1.24 seconds',
              sources: searchParams.sources.length > 0 ? searchParams.sources : 'all sources',
              dateRange: searchParams.dateRange
            }
          });
        }, 2000);
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
    if (results && results.page < results.totalPages) {
      setSearchParams(prev => ({ ...prev, page: prev.page + 1 }));
      handleSearch({ preventDefault: () => {} });
    }
  };

  const handlePrevPage = () => {
    if (results && results.page > 1) {
      setSearchParams(prev => ({ ...prev, page: prev.page - 1 }));
      handleSearch({ preventDefault: () => {} });
    }
  };

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
          <form onSubmit={handleSearch} className="space-y-4">
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
                      className={`p-2 rounded text-center text-sm ${
                        searchParams.dateRange === option.value
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
                      className={`px-3 py-1 rounded text-sm ${
                        searchParams.sources.includes(option.value)
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
                {results.items?.map((item, index) => (
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
                      {item.relevance && (
                        <>
                          <span className="mx-2">•</span>
                          <span className="bg-dark-border px-2 py-0.5 rounded-full text-xs">
                            {Math.round(item.relevance * 100)}% Relevant
                          </span>
                        </>
                      )}
                    </div>
                    
                    <p className="text-light">{item.snippet}</p>
                    
                    <div className="mt-3 flex gap-2 flex-wrap">
                      <a
                        href={item.url}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm flex items-center text-primary hover:underline"
                      >
                        <FiLink className="mr-1" />
                        View Source
                      </a>
                      
                      <button
                        className="text-sm flex items-center text-primary hover:underline"
                        onClick={() => {
                          const content = `Article URL: ${item.url}\nTitle: ${item.title}\nSource: ${item.source}\nDate: ${item.date}\nSnippet: ${item.snippet}`;
                          navigator.clipboard.writeText(content);
                          // Would normally use toast here
                          alert('Article details copied to clipboard');
                        }}
                      >
                        Copy Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {results.totalPages > 1 && (
                <div className="mt-6 flex justify-between items-center">
                  <button
                    onClick={handlePrevPage}
                    disabled={results.page === 1 || loading}
                    className="px-4 py-2 bg-dark-light text-light rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <span className="text-light-muted">
                    Page {results.page} of {results.totalPages}
                  </span>
                  
                  <button
                    onClick={handleNextPage}
                    disabled={results.page === results.totalPages || loading}
                    className="px-4 py-2 bg-dark-light text-light rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
} 