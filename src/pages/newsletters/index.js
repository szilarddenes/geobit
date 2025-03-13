import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import SubscriptionForm from '@/components/newsletter/SubscriptionForm';

export default function Newsletters() {
  // Geoscience categories with emojis
  const categories = [
    {
      id: 'hc-industry',
      name: 'HC Industry',
      emoji: '🛢️',
      description: 'Latest developments in hydrocarbon exploration, production technologies, and market trends',
      count: 58
    },
    {
      id: 'geopolitics',
      name: 'Geopolitics',
      emoji: '🌍',
      description: 'Analysis of global politics affecting energy resources, mineral rights, and international trade',
      count: 47
    },
    {
      id: 'oceanography',
      name: 'Oceanography',
      emoji: '🌊',
      description: 'The latest research on ocean currents, marine ecosystems, and sea level changes',
      count: 42
    },
    {
      id: 'climate-science',
      name: 'Climate Science',
      emoji: '🌡️',
      description: 'Studies on climate patterns, global warming effects, and atmospheric changes',
      count: 38
    },
    {
      id: 'volcanology',
      name: 'Volcanology',
      emoji: '🌋',
      description: 'Discoveries about volcanic activity, magma composition, and eruption predictions',
      count: 31
    },
    {
      id: 'seismology',
      name: 'Seismology',
      emoji: '🔄',
      description: 'Research on earthquakes, fault lines, and seismic monitoring technologies',
      count: 27
    },
    {
      id: 'planetary-science',
      name: 'Planetary Science',
      emoji: '🪐',
      description: 'Exploration of other planets, their geology, and potential for sustaining life',
      count: 35
    },
    {
      id: 'economic-geology',
      name: 'Economic Geology',
      emoji: '💎',
      description: 'Studies of mineral deposits, resource extraction, and sustainable mining practices',
      count: 29
    },
    {
      id: 'geomagnetism',
      name: 'Geomagnetism',
      emoji: '🧲',
      description: 'Research on Earth\'s magnetic field, its changes, and impact on navigation',
      count: 23
    },
    {
      id: 'hydrology',
      name: 'Hydrology',
      emoji: '💧',
      description: 'Studies of water systems, groundwater resources, and water cycle changes',
      count: 33
    },
    {
      id: 'renewable-energy',
      name: 'Renewable Energy',
      emoji: '☀️',
      description: 'Advances in sustainable energy solutions, geothermal power, and clean tech',
      count: 45
    },
    {
      id: 'geological-engineering',
      name: 'Geological Engineering',
      emoji: '🏗️',
      description: 'Innovations in construction materials, ground stability, and structural geology',
      count: 26
    }
  ];

  return (
    <Layout 
      title="Geoscience Categories - GeoBit" 
      description="Browse our curated collection of research summaries by specific geoscience disciplines"
    >
      <div className="bg-dark-lighter">
        <div className="container mx-auto px-4 py-12">
          <header className="max-w-4xl mx-auto mb-12">
            <h1 className="text-3xl font-bold text-primary mb-4">
              Geoscience Categories
            </h1>
            <p className="text-xl text-light-muted">
              Browse our curated collection of research summaries by specific geoscience disciplines
            </p>
          </header>

          <section className="max-w-4xl mx-auto mb-16">
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
              {categories.map((category) => (
                <div key={category.id} className="border-b border-dark-border pb-6">
                  <Link href={`/categories/${category.id}`} className="group">
                    <h2 className="text-xl font-bold text-light mb-2 group-hover:text-primary flex items-center">
                      <span className="mr-3 text-3xl">{category.emoji}</span>
                      {category.name}
                    </h2>
                  </Link>
                  <p className="text-light-muted mb-3">
                    {category.description}
                  </p>
                  <div className="text-sm text-light-muted">
                    {category.count} articles
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="max-w-4xl mx-auto mb-16 bg-dark-light rounded-lg p-8 border border-dark-border">
            <h2 className="text-2xl font-bold text-primary mb-4">
              Subscribe to GeoBit for Free
            </h2>
            <p className="text-light-muted mb-6">
              Get daily summaries from all categories delivered directly to your inbox
            </p>

            <div className="max-w-lg">
              <SubscriptionForm theme="dark" />
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}