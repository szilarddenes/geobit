import Head from 'next/head';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import Layout from '@/components/layout/Layout';

export default function Categories() {
    // Sample geoscience categories
    const categories = [
        {
            id: 'oceanography',
            name: 'Oceanography',
            description: 'The latest research on ocean currents, marine ecosystems, and sea level changes',
            count: 42
        },
        {
            id: 'climate-science',
            name: 'Climate Science',
            description: 'Studies on climate patterns, global warming effects, and atmospheric changes',
            count: 38
        },
        {
            id: 'volcanology',
            name: 'Volcanology',
            description: 'Discoveries about volcanic activity, magma composition, and eruption predictions',
            count: 31
        },
        {
            id: 'seismology',
            name: 'Seismology',
            description: 'Research on earthquakes, fault lines, and seismic monitoring technologies',
            count: 27
        },
        {
            id: 'planetary-science',
            name: 'Planetary Science',
            description: 'Exploration of other planets, their geology, and potential for sustaining life',
            count: 35
        },
        {
            id: 'economic-geology',
            name: 'Economic Geology',
            description: 'Studies of mineral deposits, resource extraction, and sustainable mining practices',
            count: 29
        },
        {
            id: 'geomagnetism',
            name: 'Geomagnetism',
            description: 'Research on Earth\'s magnetic field, its changes, and impact on navigation',
            count: 23
        },
        {
            id: 'hydrology',
            name: 'Hydrology',
            description: 'Studies of water systems, groundwater resources, and water cycle changes',
            count: 33
        }
    ];

    return (
        <Layout>
            <Head>
                <title>Categories - GeoBit</title>
                <meta name="description" content="Browse geoscience news by category" />
            </Head>

            <div className="container mx-auto px-4 py-12">
                <header className="max-w-4xl mx-auto mb-12">
                    <h1 className="text-3xl font-bold text-light mb-4">
                        Geoscience Categories
                    </h1>
                    <p className="text-lg text-light-muted">
                        Browse our curated collection of research summaries by specific geoscience disciplines
                    </p>
                </header>

                <section className="max-w-4xl mx-auto mb-16">
                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-10">
                        {categories.map((category) => (
                            <div key={category.id} className="border-b border-dark-lighter pb-6">
                                <Link href={`/categories/${category.id}`}>
                                    <h2 className="text-xl font-bold text-light mb-2 hover:text-primary flex items-center">
                                        {category.name}
                                        <FiArrowRight className="ml-2" size={18} />
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

                <section className="max-w-4xl mx-auto mb-16 bg-dark-lighter rounded-lg p-8">
                    <h2 className="text-2xl font-bold text-light mb-4">
                        Subscribe to GeoBit for Free
                    </h2>
                    <p className="text-light-muted mb-6">
                        Get daily summaries from all categories delivered directly to your inbox
                    </p>

                    <form className="flex flex-col sm:flex-row max-w-lg gap-3">
                        <input
                            type="email"
                            className="flex-grow px-4 py-3 border border-dark-lighter rounded-md bg-dark text-light focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="Enter your email"
                            required
                        />
                        <button
                            type="submit"
                            className="px-6 py-3 bg-primary hover:bg-primary-light text-dark font-medium rounded-md transition duration-200"
                        >
                            Subscribe
                        </button>
                    </form>
                </section>
            </div>
        </Layout>
    );
}
