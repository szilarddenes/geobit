import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import ArticleCard from '@/components/newsletter/ArticleCard';
import SubscriptionForm from '@/components/newsletter/SubscriptionForm';

export default function Archive() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample archive of geoscience articles
  const allArticles = [
    {
      id: 1,
      title: "New Study Reveals Ancient Sea Levels Were Higher Than Previously Thought",
      category: "Oceanography",
      date: "Mar 12, 2025",
      readTime: "3 min read",
      summary: "Researchers found evidence suggesting sea levels during the last interglacial period were up to 3 meters higher than current estimates.",
      source: "Nature",
    },
    {
      id: 2,
      title: "Discovery of Rare Mineral Formation Challenges Current Volcanic Theories",
      category: "Volcanology",
      date: "Mar 12, 2025",
      readTime: "4 min read",
      summary: "Unusual mineral deposits found in Indonesian volcano may require revisions to our understanding of magma chamber dynamics.",
      source: "Science",
    },
    {
      id: 3,
      title: "Climate Models Underestimated Arctic Ice Loss, New Data Shows",
      category: "Climate Science",
      date: "Mar 11, 2025",
      readTime: "5 min read",
      summary: "Satellite measurements reveal Arctic ice is melting at rates faster than predicted by leading climate models, raising concerns about feedback loops.",
      source: "Geophysical Research Letters",
    },
    {
      id: 4,
      title: "Underground Water Reservoirs Found on Mars Signal Potential for Past Life",
      category: "Planetary Science",
      date: "Mar 11, 2025",
      readTime: "6 min read",
      summary: "NASA's Perseverance rover has uncovered evidence of ancient subsurface water reservoirs that could have supported microbial life.",
      source: "NASA",
    },
    {
      id: 5,
      title: "Advanced Seismic Monitoring Tool Shows Promise for Earthquake Prediction",
      category: "Seismology",
      date: "Mar 10, 2025",
      readTime: "4 min read",
      summary: "A new AI-powered seismic monitoring system can detect subtle foreshocks with greater accuracy, potentially providing earlier warnings.",
      source: "USGS",
    },
    {
      id: 6,
      title: "Machine Learning Helps Identify New Mineral Deposits in Remote Locations",
      category: "Economic Geology",
      date: "Mar 10, 2025",
      readTime: "3 min read",
      summary: "Geologists are using machine learning algorithms to identify promising mineral deposits in regions that were previously difficult to survey.",
      source: "Mining Journal",
    },
    {
      id: 7,
      title: "Earth's Magnetic Field Reversal Could Happen Sooner Than Expected",
      category: "Geomagnetism",
      date: "Mar 9, 2025",
      readTime: "5 min read",
      summary: "New measurements of Earth's magnetic field suggest that a polarity reversal might occur within the next few thousand years, not tens of thousands.",
      source: "Eos",
    },
    {
      id: 8,
      title: "Novel Technique Improves Groundwater Contamination Detection",
      category: "Hydrology",
      date: "Mar 9, 2025",
      readTime: "3 min read",
      summary: "A new spectroscopic method can detect trace contaminants in groundwater at much lower concentrations than previous techniques allowed.",
      source: "Environmental Science & Technology",
    }
  ];
  
  // Filter articles based on search term
  const filteredArticles = allArticles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Layout
      title="Archive - GeoBit"
      description="Browse our archive of geoscience research summaries and news"
    >
      <div className="container mx-auto px-4 py-12">
        <header className="max-w-4xl mx-auto mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Article Archive
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Browse our complete collection of geoscience research summaries and news
          </p>
          
          {/* Search bar */}
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search articles by title, category or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </header>

        <section className="max-w-4xl mx-auto mb-16">
          {filteredArticles.length > 0 ? (
            <div className="grid gap-6">
              {filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-xl text-gray-600">No articles found matching your search.</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-4 text-blue-600 font-medium hover:text-blue-700"
              >
                Clear search
              </button>
            </div>
          )}
        </section>

        <section className="max-w-4xl mx-auto mb-16 bg-gray-900 text-white rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Get Daily Geoscience Updates
          </h2>
          <p className="text-gray-300 mb-6">
            Subscribe to our free daily newsletter and never miss important research updates
          </p>

          <div className="max-w-lg">
            <SubscriptionForm theme="dark" />
          </div>
        </section>
      </div>
    </Layout>
  );
}
