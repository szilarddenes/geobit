import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { FiClock, FiArrowLeft } from 'react-icons/fi';

// Sample category data (in a real app, this would come from a database)
const categories = {
    'oceanography': {
        name: 'Oceanography',
        description: 'The latest research on ocean currents, marine ecosystems, and sea level changes',
        articles: [
            {
                id: 1,
                title: 'New Study Reveals Ancient Sea Levels Were Higher Than Previously Thought',
                date: 'Mar 12',
                readTime: '3 minute read',
                excerpt: 'Researchers have found evidence that sea levels during the last interglacial period were higher than current models predict, suggesting faster ice sheet melt rates.'
            },
            {
                id: 2,
                title: 'Deep Ocean Currents Show Surprising Variability, Study Finds',
                date: 'Mar 10',
                readTime: '4 minute read',
                excerpt: 'Long-term observations of Atlantic Meridional Overturning Circulation reveal previously unknown patterns of variability that may impact climate predictions.'
            },
            {
                id: 3,
                title: 'Microplastics Found in Deepest Ocean Trenches',
                date: 'Mar 8',
                readTime: '5 minute read',
                excerpt: 'Scientists have documented microplastic pollution in sediments from the Mariana Trench, highlighting the pervasive spread of human-made materials.'
            },
            {
                id: 4,
                title: 'New Technology Maps Ocean Floor with Unprecedented Precision',
                date: 'Mar 5',
                readTime: '3 minute read',
                excerpt: 'Researchers have developed an advanced sonar system that can map the ocean floor with resolution ten times better than previous technologies.'
            },
            {
                id: 5,
                title: 'Coral Reefs Adapting Faster Than Expected to Warming Oceans',
                date: 'Mar 3',
                readTime: '6 minute read',
                excerpt: 'Certain coral species are showing signs of rapid adaptation to higher temperatures, offering hope for reef survival amid climate change.'
            }
        ]
    },
    'climate-science': {
        name: 'Climate Science',
        description: 'Studies on climate patterns, global warming effects, and atmospheric changes',
        articles: [
            {
                id: 1,
                title: 'Climate Models Underestimated Arctic Ice Loss, New Data Shows',
                date: 'Mar 11',
                readTime: '5 minute read',
                excerpt: 'Satellite data reveals Arctic sea ice is melting faster than even the most pessimistic climate models had predicted.'
            },
            {
                id: 2,
                title: 'Ancient Tree Rings Reveal Unprecedented Modern Warming',
                date: 'Mar 9',
                readTime: '4 minute read',
                excerpt: 'Analysis of tree rings dating back 2,000 years confirms that current warming rates exceed natural variability by a significant margin.'
            }
        ]
    },
    'volcanology': {
        name: 'Volcanology',
        description: 'Discoveries about volcanic activity, magma composition, and eruption predictions',
        articles: [
            {
                id: 1,
                title: 'Discovery of Rare Mineral Formation Challenges Current Volcanic Theories',
                date: 'Mar 12',
                readTime: '4 minute read',
                excerpt: 'Unusual mineral formations found in volcanic deposits suggest magma mixing processes may be more complex than previously understood.'
            }
        ]
    },
    'geomagnetism': {
        name: 'Geomagnetism',
        description: 'Research on Earth\'s magnetic field, its changes, and impact on navigation',
        count: 23
    }
    // Other categories would be defined here
};

export default function CategoryPage() {
    const router = useRouter();
    const { slug } = router.query;

    // Handle loading state or invalid categories
    if (router.isFallback || !slug || !categories[slug]) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-gray-600">
                    {router.isFallback ? 'Loading...' : 'Category not found'}
                </p>
            </div>
        );
    }

    const category = categories[slug];

    return (
        <>
            <Head>
                <title>{category.name} - GeoBit</title>
                <meta name="description" content={category.description} />
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
                    <div className="max-w-4xl mx-auto">
                        <Link href="/categories" className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
                            <FiArrowLeft className="mr-2" size={16} />
                            All Categories
                        </Link>

                        <header className="mb-12">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                {category.name}
                            </h1>
                            <p className="text-lg text-gray-600">
                                {category.description}
                            </p>
                        </header>

                        <section className="mb-16">
                            <div className="space-y-10">
                                {category.articles.map((article) => (
                                    <div key={article.id} className="border-b border-gray-200 pb-10">
                                        <div className="flex items-center text-sm text-gray-500 mb-2">
                                            <span>{article.date}</span>
                                            <span className="mx-2">|</span>
                                            <span>{category.name}</span>
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 cursor-pointer">
                                            {article.title}
                                        </h2>
                                        <p className="text-gray-600 mb-3">
                                            {article.excerpt}
                                        </p>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <FiClock className="mr-1" size={14} />
                                            <span>{article.readTime}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="mb-16 bg-gray-50 rounded-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Get {category.name} Updates
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Subscribe to GeoBit for daily summaries of the latest research in {category.name} and other geoscience fields
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

                        <footer className="py-8 border-t border-gray-200 text-center text-gray-500 text-sm">
                            <div className="flex justify-center space-x-6 mb-4">
                                <Link href="/privacy" className="hover:text-gray-900">Privacy</Link>
                                <Link href="/careers" className="hover:text-gray-900">Careers</Link>
                                <Link href="/advertise" className="hover:text-gray-900">Advertise</Link>
                            </div>
                            <p>&copy; {new Date().getFullYear()} GeoBit. All rights reserved.</p>
                        </footer>
                    </div>
                </div>
            </main>
        </>
    );
} 