import { useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import ArticleCard from '@/components/newsletter/ArticleCard';
import SubscriptionForm from '@/components/newsletter/SubscriptionForm';

export default function Home() {
  // Sample geoscience news articles (these would come from your database in production)
  const featuredArticles = [
    {
      id: 1,
      title: 'New Study Reveals Ancient Sea Levels Were Higher Than Previously Thought',
      category: 'Oceanography',
      date: 'Mar 12',
      readTime: '3 minute read',
      summary: 'Researchers found evidence suggesting sea levels during the last interglacial period were up to 3 meters higher than current estimates.',
      source: 'Nature',
      url: '/article/oceanography-sea-levels'
    },
    {
      id: 2,
      title: 'Discovery of Rare Mineral Formation Challenges Current Volcanic Theories',
      category: 'Volcanology',
      date: 'Mar 12',
      readTime: '4 minute read',
      summary: 'Unusual mineral deposits found in Indonesian volcano may require revisions to our understanding of magma chamber dynamics.',
      source: 'Science',
      url: '/article/volcanology-mineral-formation'
    },
    {
      id: 3,
      title: 'Climate Models Underestimated Arctic Ice Loss, New Data Shows',
      category: 'Climate Science',
      date: 'Mar 11',
      readTime: '5 minute read',
      summary: 'Satellite measurements reveal Arctic ice is melting at rates faster than predicted by leading climate models, raising concerns about feedback loops.',
      source: 'Geophysical Research Letters',
      url: '/article/climate-arctic-ice'
    }
  ];

  const recentArticles = [
    {
      id: 4,
      title: 'Underground Water Reservoirs Found on Mars Signal Potential for Past Life',
      category: 'Planetary Science',
      date: 'Mar 11',
      readTime: '6 minute read',
      source: 'NASA',
      url: '/article/mars-water-reservoir'
    },
    {
      id: 5,
      title: 'Advanced Seismic Monitoring Tool Shows Promise for Earthquake Prediction',
      category: 'Seismology',
      date: 'Mar 10',
      readTime: '4 minute read',
      source: 'USGS',
      url: '/article/seismic-monitoring-tool'
    },
    {
      id: 6,
      title: 'Machine Learning Helps Identify New Mineral Deposits in Remote Locations',
      category: 'Economic Geology',
      date: 'Mar 10',
      readTime: '3 minute read',
      source: 'Mining Journal',
      url: '/article/machine-learning-mineral-deposits'
    },
    {
      id: 7,
      title: 'Earth\'s Magnetic Field Reversal Could Happen Sooner Than Expected',
      category: 'Geomagnetism',
      date: 'Mar 9',
      readTime: '5 minute read',
      source: 'Eos',
      url: '/article/magnetic-field-reversal'
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              Keep up with geoscience in 5 minutes
            </h1>
            <p className="text-xl text-neutral-600 mb-10 max-w-3xl mx-auto">
              Get the free daily email with concise summaries of the most interesting research and developments in earth sciences
            </p>

            <SubscriptionForm />
            
            <p className="text-sm text-neutral-500 mt-3">
              Join 50,000+ geoscientists for one daily email
            </p>
          </div>
        </section>

        {/* Featured Section */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">
            Featured Articles
          </h2>

          <div className="space-y-8">
            {featuredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} featured={true} />
            ))}
          </div>
        </section>

        {/* Recent Articles Section */}
        <section className="max-w-4xl mx-auto mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">
              Recent Articles
            </h2>
            <Link href="/archive" className="flex items-center text-primary-600 hover:text-primary-700">
              View all articles
              <FiArrowRight className="ml-1" size={16} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {recentArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="max-w-4xl mx-auto mb-20 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">
            Get the GeoBit Newsletter
          </h2>
          <p className="text-neutral-600 mb-6">
            Stay informed with the latest geoscience discoveries, trends, and research summaries delivered directly to your inbox.
          </p>

          <SubscriptionForm buttonText="Join Now" compact={true} />
        </section>
      </div>
    </Layout>
  );
}