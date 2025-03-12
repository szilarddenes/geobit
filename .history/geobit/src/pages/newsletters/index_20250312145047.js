import Head from 'next/head';
import Link from 'next/link';
import { FiCalendar } from 'react-icons/fi';

export default function Newsletters() {
    // Sample newsletters data (this would come from a database in a real app)
    const newsletters = [
        {
            id: 'issue-12',
            title: 'GeoBit Issue #12: Breakthrough in Earthquake Prediction & Climate Model Updates',
            date: 'March 12, 2023',
            summary: 'This week we explore a new statistical model for earthquake prediction, the latest climate model insights, and revolutionary deep ocean mapping technology.'
        },
        {
            id: 'issue-11',
            title: 'GeoBit Issue #11: Volcanic Activity Monitoring & Arctic Ice Coverage',
            date: 'March 5, 2023',
            summary: 'Our latest issue covers advancements in volcanic monitoring technology, surprising findings about Arctic ice coverage, and a new mineral discovery in Tanzania.'
        },
        {
            id: 'issue-10',
            title: 'GeoBit Issue #10: Mars Water Discovery & Earth\'s Magnetic Field Study',
            date: 'February 27, 2023',
            summary: 'This week we dive into the remarkable water reservoirs found on Mars, concerning changes in Earth\'s magnetic field, and innovative mineral exploration techniques.'
        },
        {
            id: 'issue-9',
            title: 'GeoBit Issue #9: Ocean Currents Research & Ancient Climate Records',
            date: 'February 20, 2023',
            summary: 'Our latest issue examines new findings on deep ocean currents, ancient climate records uncovered from tree rings, and plastic pollution in marine ecosystems.'
        },
        {
            id: 'issue-8',
            title: 'GeoBit Issue #8: Coral Reef Adaptation & Mining Sustainability',
            date: 'February 13, 2023',
            summary: 'This week we focus on surprising coral reef adaptation to climate change, sustainable mining practices, and new data on historical sea level variations.'
        },
        {
            id: 'issue-7',
            title: 'GeoBit Issue #7: Seismic Monitoring Breakthroughs & Planetary Geology',
            date: 'February 6, 2023',
            summary: 'Our latest issue delves into next-generation seismic monitoring tools, comparative studies of Earth and Mars geology, and freshwater resource management innovations.'
        }
    ];

    return (
        <>
            <Head>
                <title>Newsletters - GeoBit</title>
                <meta name="description" content="Archive of GeoBit newsletters covering the latest geoscience research" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="min-h-screen bg-white">
                <nav className="border-b border-gray-200">
                    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                        <Link href="/" className="font-bold text-2xl text-gray-900">GeoBit</Link>
                        <div className="flex space-x-6">
                            <Link href="/newsletters" className="text-gray-600 hover:text-gray-900 font-medium">Newsletters</Link>
                            <Link href="/categories" className="text-gray-600 hover:text-gray-900">Categories</Link>
                            <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
                        </div>
                    </div>
                </nav>

                <div className="container mx-auto px-4 py-12">
                    <header className="max-w-4xl mx-auto mb-12">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            GeoBit Newsletters
                        </h1>
                        <p className="text-lg text-gray-600">
                            Browse our archive of past newsletters with concise summaries of the most important geoscience research
                        </p>
                    </header>

                    <section className="max-w-4xl mx-auto mb-16">
                        <div className="space-y-10">
                            {newsletters.map((newsletter) => (
                                <div key={newsletter.id} className="border-b border-gray-200 pb-10">
                                    <div className="flex items-center text-sm text-gray-500 mb-2">
                                        <FiCalendar className="mr-1" size={14} />
                                        <span>{newsletter.date}</span>
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 cursor-pointer">
                                        <Link href={`/newsletters/${newsletter.id}`}>
                                            {newsletter.title}
                                        </Link>
                                    </h2>
                                    <p className="text-gray-600">
                                        {newsletter.summary}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="max-w-4xl mx-auto mb-16 bg-gray-50 rounded-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Never Miss an Issue
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Subscribe to receive the GeoBit newsletter directly in your inbox
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