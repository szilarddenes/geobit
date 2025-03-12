import Head from 'next/head';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

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
            description: 'Research on Earth's magnetic field, its changes, and impact on navigation',
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
        <>
            <Head>
                <title>Categories - GeoBit</title>
                <meta name="description" content="Browse geoscience news by category" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="min-h-screen bg-white">
                <nav className="border-b border-gray-200">
                    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                        <Link href="/" className="font-bold text-2xl text-gray-900">GeoBit</Link>
                        <div className="flex space-x-6">
                            <Link href="/newsletters" className="text-gray-600 hover:text-gray-900">Newsletters</Link>
                            <Link href="/categories" className="text-gray-600 hover:text-gray-900 font-medium">Categories</Link>
                            <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
                        </div>
                    </div>
                </nav>

                <div className="container mx-auto px-4 py-12">
                    <header className="max-w-4xl mx-auto mb-12">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            Geoscience Categories
                        </h1>
                        <p className="text-lg text-gray-600">
                            Browse our curated collection of research summaries by specific geoscience disciplines
                        </p>
                    </header>

                    <section className="max-w-4xl mx-auto mb-16">
                        <div className="grid md:grid-cols-2 gap-x-8 gap-y-10">
                            {categories.map((category) => (
                                <div key={category.id} className="border-b border-gray-200 pb-6">
                                    <Link href={`/categories/${category.id}`}>
                                        <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 flex items-center">
                                            {category.name}
                                            <FiArrowRight className="ml-2" size={18} />
                                        </h2>
                                    </Link>
                                    <p className="text-gray-600 mb-3">
                                        {category.description}
                                    </p>
                                    <div className="text-sm text-gray-500">
                                        {category.count} articles
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="max-w-4xl mx-auto mb-16 bg-gray-50 rounded-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Subscribe to GeoBit for Free
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Get daily summaries from all categories delivered directly to your inbox
                        </p>

                        <form className="flex flex-col sm:flex-row max-w-lg gap-3">
                            <input
                                type="email"
                                className="flex-grow px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your email"
                                required
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200"
                            >
                                Subscribe
                            </button>
                        </form>
                    </section>

                    <footer className="max-w-4xl mx-auto py-8 border-t border-gray-200 text-center text-gray-500 text-sm">
                        <div className="flex justify-center space-x-6 mb-4">
                            <Link href="/privacy" className="hover:text-gray-900">Privacy</Link>
                            <Link href="/careers" className="hover:text-gray-900">Careers</Link>
                            <Link href="/advertise" className="hover:text-gray-900">Advertise</Link>
                        </div>
                        <p>&copy; {new Date().getFullYear()} GeoBit. All rights reserved.</p>
                    </footer>
                </div>
            </main>
        </>
    );
} 