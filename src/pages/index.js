import { FiArrowDown } from 'react-icons/fi';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import ArticleCard from '@/components/newsletter/ArticleCard';
import SubscriptionForm from '@/components/newsletter/SubscriptionForm';

export default function Home() {
  // Sample geoscience news articles
  const featuredArticles = [
    {
      id: 1,
      title: "New Study Reveals Ancient Sea Levels Were Higher Than Previously Thought",
      category: "Oceanography",
      date: "Mar 12",
      readTime: "3 min read",
      summary: "Researchers found evidence suggesting sea levels during the last interglacial period were up to 3 meters higher than current estimates.",
      source: "Nature",
    },
    {
      id: 2,
      title: "Discovery of Rare Mineral Formation Challenges Current Volcanic Theories",
      category: "Volcanology",
      date: "Mar 12",
      readTime: "4 min read",
      summary: "Unusual mineral deposits found in Indonesian volcano may require revisions to our understanding of magma chamber dynamics.",
      source: "Science",
    },
    {
      id: 3,
      title: "Climate Models Underestimated Arctic Ice Loss, New Data Shows",
      category: "Climate Science",
      date: "Mar 11",
      readTime: "5 min read",
      summary: "Satellite measurements reveal Arctic ice is melting at rates faster than predicted by leading climate models, raising concerns about feedback loops.",
      source: "Geophysical Research Letters",
    }
  ];

  const recentArticles = [
    {
      id: 4,
      title: "Underground Water Reservoirs Found on Mars Signal Potential for Past Life",
      category: "Planetary Science",
      date: "Mar 11",
      readTime: "6 min read",
      source: "NASA",
    },
    {
      id: 5,
      title: "Advanced Seismic Monitoring Tool Shows Promise for Earthquake Prediction",
      category: "Seismology",
      date: "Mar 10",
      readTime: "4 min read",
      source: "USGS",
    },
    {
      id: 6,
      title: "Machine Learning Helps Identify New Mineral Deposits in Remote Locations",
      category: "Economic Geology",
      date: "Mar 10",
      readTime: "3 min read",
      source: "Mining Journal",
    },
    {
      id: 7,
      title: "Earth's Magnetic Field Reversal Could Happen Sooner Than Expected",
      category: "Geomagnetism",
      date: "Mar 9",
      readTime: "5 min read",
      source: "Eos",
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            GEOSCIENCE<br />IN 5 MINUTES DAILY
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10">
            Get the <span className="text-blue-600 font-bold">most important</span> earth science research and discoveries in a free daily email.
          </p>

          <div className="max-w-md mx-auto mb-8">
            <SubscriptionForm buttonText="Subscribe for Free" />
          </div>

          <div className="mt-12">
            <a href="#articles" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
              Explore articles
              <FiArrowDown className="ml-2 animate-bounce" />
            </a>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section id="articles" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Featured Research</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Top Categories</h2>
            <Link
              href="/categories"
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              View all categories
            </Link>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: 'Climate Science', emoji: '🌡️', count: 42 },
              { name: 'Oceanography', emoji: '🌊', count: 38 },
              { name: 'Volcanology', emoji: '🌋', count: 31 },
              { name: 'Seismology', emoji: '📈', count: 27 }
            ].map((category) => (
              <Link
                key={category.name}
                href={`/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-white border border-gray-200 rounded-lg p-6 transition-shadow hover:shadow-md"
              >
                <div className="text-3xl mb-2">{category.emoji}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count} articles</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Articles */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Latest Updates</h2>
            <Link
              href="/archive"
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              View all articles
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {recentArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gray-900 text-white p-10 rounded-lg max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Never Miss Important Research</h2>
            <p className="text-gray-300 mb-6">
              Stay informed with the latest geoscience discoveries, trends, and research summaries delivered directly to your inbox.
            </p>
            <div className="max-w-md mx-auto">
              <SubscriptionForm buttonText="Join Now" theme="dark" />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
