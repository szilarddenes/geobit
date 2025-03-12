import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import ArticleCard from '@/components/newsletter/ArticleCard';
import SubscriptionForm from '@/components/newsletter/SubscriptionForm';
import { FiCalendar, FiFilter, FiSearch } from 'react-icons/fi';

export default function Archive() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Sample archive data - would come from your database in production
  const archiveArticles = [
    {
      id: 1,
      title: 'New Study Reveals Ancient Sea Levels Were Higher Than Previously Thought',
      category: 'Oceanography',
      date: 'Mar 12, 2025',
      readTime: '3 minute read',
      summary: 'Researchers found evidence suggesting sea levels during the last interglacial period were up to 3 meters higher than current estimates.',
      source: 'Nature',
      url: '/article/oceanography-sea-levels'
    },
    {
      id: 2,
      title: 'Discovery of Rare Mineral Formation Challenges Current Volcanic Theories',
      category: 'Volcanology',
      date: 'Mar 12, 2025',
      readTime: '4 minute read',
      source: 'Science',
      url: '/article/volcanology-mineral-formation'
    },
    {
      id: 3,
      title: 'Climate Models Underestimated Arctic Ice Loss, New Data Shows',
      category: 'Climate Science',
      date: 'Mar 11, 2025',
      readTime: '5 minute read',
      source: 'Geophysical Research Letters',
      url: '/article/climate-arctic-ice'
    },
    {
      id: 4,
      title: 'Underground Water Reservoirs Found on Mars Signal Potential for Past Life',
      category: 'Planetary Science',
      date: 'Mar 11, 2025',
      readTime: '6 minute read',
      source: 'NASA',
      url: '/article/mars-water-reservoir'
    },
    {
      id: 5,
      title: 'Advanced Seismic Monitoring Tool Shows Promise for Earthquake Prediction',
      category: 'Seismology',
      date: 'Mar 10, 2025',
      readTime: '4 minute read',
      source: 'USGS',
      url: '/article/seismic-monitoring-tool'
    },
    {
      id: 6,
      title: 'Machine Learning Helps Identify New Mineral Deposits in Remote Locations',
      category: 'Economic Geology',
      date: 'Mar 10, 2025',
      readTime: '3 minute read',
      source: 'Mining Journal',
      url: '/article/machine-learning-mineral-deposits'
    },
    {
      id: 7,
      title: 'Earth\'s Magnetic Field Reversal Could Happen Sooner Than Expected',
      category: 'Geomagnetism',
      date: 'Mar 9, 2025',
      readTime: '5 minute read',
      source: 'Eos',
      url: '/article/magnetic-field-reversal'
    },
    {
      id: 8,
      title: 'Paleontologists Discover New Dinosaur Species in Montana Badlands',
      category: 'Paleontology',
      date: 'Mar 8, 2025',
      readTime: '4 minute read',
      source: 'Journal of Vertebrate Paleontology',
      url: '/article/new-dinosaur-species'
    }
  ];

  // Get unique categories for the filter
  const categories = [...new Set(archiveArticles.map(article => article.category))];

  // Filter articles based on search term and category
  const filteredArticles = archiveArticles.filter(article => {
    return (
      (searchTerm === '' || 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (categoryFilter === '' || article.category === categoryFilter)
    );
  });

  return (
    <Layout 
      title="Archive" 
      description="Browse our archive of geoscience newsletter articles"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              GeoBit Archive
            </h1>
            <p className="text-xl text-neutral-600">
              Browse all our past articles and research summaries
            </p>
          </header>

          {/* Filters */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="text-gray-400" />
              </div>
              <select
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Articles Grid */}
          <div className="mb-12">
            {filteredArticles.length > 0 ? (
              <div className="space-y-8">
                {filteredArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-neutral-600">No articles match your search criteria.</p>
              </div>
            )}
          </div>

          {/* Newsletter CTA */}
          <div className="bg-gray-50 rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              Never Miss an Update
            </h2>
            <p className="text-neutral-600 mb-6">
              Get the latest geoscience news delivered straight to your inbox.
            </p>

            <SubscriptionForm buttonText="Subscribe Now" compact={true} />
          </div>
        </div>
      </div>
    </Layout>
  );
}