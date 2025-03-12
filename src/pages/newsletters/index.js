import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import ArticleCard from '@/components/newsletter/ArticleCard';
import SubscriptionForm from '@/components/newsletter/SubscriptionForm';

export default function Newsletters() {
  // Sample newsletters categorized by date
  const newsletters = {
    'March 2025': [
      {
        id: 'mar-12-2025',
        title: 'Daily Update - March 12, 2025',
        date: 'Mar 12, 2025',
        articles: [
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
          }
        ]
      },
      {
        id: 'mar-11-2025',
        title: 'Daily Update - March 11, 2025',
        date: 'Mar 11, 2025',
        articles: [
          {
            id: 3,
            title: "Climate Models Underestimated Arctic Ice Loss, New Data Shows",
            category: "Climate Science",
            date: "Mar 11",
            readTime: "5 min read",
            summary: "Satellite measurements reveal Arctic ice is melting at rates faster than predicted by leading climate models, raising concerns about feedback loops.",
            source: "Geophysical Research Letters",
          },
          {
            id: 4,
            title: "Underground Water Reservoirs Found on Mars Signal Potential for Past Life",
            category: "Planetary Science",
            date: "Mar 11",
            readTime: "6 min read",
            summary: "NASA's Perseverance rover has uncovered evidence of ancient subsurface water reservoirs that could have supported microbial life.",
            source: "NASA",
          }
        ]
      },
      {
        id: 'mar-10-2025',
        title: 'Daily Update - March 10, 2025',
        date: 'Mar 10, 2025',
        articles: [
          {
            id: 5,
            title: "Advanced Seismic Monitoring Tool Shows Promise for Earthquake Prediction",
            category: "Seismology",
            date: "Mar 10",
            readTime: "4 min read",
            summary: "A new AI-powered seismic monitoring system can detect subtle foreshocks with greater accuracy, potentially providing earlier warnings.",
            source: "USGS",
          },
          {
            id: 6,
            title: "Machine Learning Helps Identify New Mineral Deposits in Remote Locations",
            category: "Economic Geology",
            date: "Mar 10",
            readTime: "3 min read",
            summary: "Geologists are using machine learning algorithms to identify promising mineral deposits in regions that were previously difficult to survey.",
            source: "Mining Journal",
          }
        ]
      }
    ],
    'February 2025': [
      {
        id: 'feb-28-2025',
        title: 'Daily Update - February 28, 2025',
        date: 'Feb 28, 2025',
        articles: [
          {
            id: 9,
            title: "Revolutionary Imaging Technique Visualizes Deep Earth Mantle Structures",
            category: "Geophysics",
            date: "Feb 28",
            readTime: "4 min read",
            summary: "A new seismic imaging technique has provided unprecedented views of structures in Earth's mantle, revealing complex convection patterns.",
            source: "Science",
          }
        ]
      }
    ]
  };

  return (
    <Layout
      title="Newsletters - GeoBit"
      description="Browse our daily geoscience newsletter archives"
    >
      <div className="container mx-auto px-4 py-12">
        <header className="max-w-4xl mx-auto mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Newsletter Archive
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Browse our daily geoscience updates by date
          </p>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Never miss an update!
            </h2>
            <SubscriptionForm buttonText="Subscribe for Free" />
          </div>
        </header>

        <section className="max-w-4xl mx-auto">
          {Object.entries(newsletters).map(([month, issues]) => (
            <div key={month} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">
                {month}
              </h2>
              
              <div className="space-y-10">
                {issues.map((issue) => (
                  <div key={issue.id} className="border-b border-gray-100 pb-10 last:border-b-0">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {issue.title}
                    </h3>
                    <div className="text-sm text-gray-500 mb-6">
                      {issue.date}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {issue.articles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                      ))}
                    </div>
                    
                    <div className="mt-6 text-center">
                      <a 
                        href={`/newsletters/${issue.id}`}
                        className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
                      >
                        View full newsletter
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </Layout>
  );
}
