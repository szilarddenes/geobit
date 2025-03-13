import { useState } from 'react';
import { searchGeoscienceArticles } from '@/lib/openrouter';

/**
 * Component for searching geoscience articles using Perplexity
 * @param {function} onArticleSelect - Callback when an article is selected
 */
export default function ArticleSearch({ onArticleSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');
  const [usedModel, setUsedModel] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim() || isSearching) return;
    
    setIsSearching(true);
    setError('');
    setSearchResults([]);
    
    try {
      const results = await searchGeoscienceArticles(searchTerm);
      setSearchResults(results);
      
      // The model info might be available in the future from the searchGeoscienceArticles function
      setUsedModel('perplexity/sonar-small-online');
    } catch (error) {
      console.error('Error searching for articles:', error);
      setError('Failed to search for articles. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleArticleSelect = (article) => {
    if (onArticleSelect) {
      onArticleSelect(article);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Geoscience Article Search</h3>
      
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
            placeholder="Search for geoscience articles..."
            disabled={isSearching}
          />
          <button
            type="submit"
            disabled={isSearching || !searchTerm.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Powered by Perplexity web search - find recent geoscience articles on any topic
        </p>
      </form>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {usedModel && searchResults.length > 0 && (
        <p className="text-xs text-gray-500 mb-2">
          Search performed using {usedModel}
        </p>
      )}
      
      {searchResults.length > 0 ? (
        <div className="space-y-4">
          {searchResults.map((article, index) => (
            <div 
              key={index} 
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleArticleSelect(article)}
            >
              <h4 className="font-medium text-blue-600">{article.title}</h4>
              <p className="text-sm text-gray-500 mt-1">
                {article.authors} • {article.date}
              </p>
              <p className="text-sm mt-2">{article.description}</p>
              <a 
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:text-blue-700 mt-2 inline-block"
                onClick={(e) => e.stopPropagation()} // Prevent triggering select when clicking the link
              >
                View Original
              </a>
            </div>
          ))}
        </div>
      ) : searchTerm && !isSearching ? (
        <p className="text-center text-gray-500 py-4">No articles found. Try a different search term.</p>
      ) : null}
    </div>
  );
} 