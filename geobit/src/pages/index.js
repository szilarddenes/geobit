import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'react-toastify';
import { FiClock, FiArrowRight } from 'react-icons/fi';

export default function Home() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubscribe = async (e) => {
        e.preventDefault();

        if (!email || !email.includes('@')) {
            toast.error('Please enter a valid email address');
            return;
        }

        setIsSubmitting(true);

        try {
            await addDoc(collection(db, 'subscribers'), {
                email,
                status: 'active',
                createdAt: new Date()
            });

            toast.success('Thank you for subscribing!');
            setEmail('');
            router.push('/subscribe/success');
        } catch (error) {
            console.error('Error subscribing:', error);
            toast.error('Subscription failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Sample geoscience news articles (these would come from your database in production)
    const featuredArticles = [
        {
            id: 1,
            title: 'New Study Reveals Ancient Sea Levels Were Higher Than Previously Thought',
            category: 'Oceanography',
            date: 'Mar 12',
            readTime: '3 minute read'
        },
        {
            id: 2,
            title: 'Discovery of Rare Mineral Formation Challenges Current Volcanic Theories',
            category: 'Volcanology',
            date: 'Mar 12',
            readTime: '4 minute read'
        },
        {
            id: 3,
            title: 'Climate Models Underestimated Arctic Ice Loss, New Data Shows',
            category: 'Climate Science',
            date: 'Mar 11',
            readTime: '5 minute read'
        }
    ];

    const recentArticles = [
        {
            id: 4,
            title: 'Underground Water Reservoirs Found on Mars Signal Potential for Past Life',
            category: 'Planetary Science',
            date: 'Mar 11',
            readTime: '6 minute read'
        },
        {
            id: 5,
            title: 'Advanced Seismic Monitoring Tool Shows Promise for Earthquake Prediction',
            category: 'Seismology',
            date: 'Mar 10',
            readTime: '4 minute read'
        },
        {
            id: 6,
            title: 'Machine Learning Helps Identify New Mineral Deposits in Remote Locations',
            category: 'Economic Geology',
            date: 'Mar 10',
            readTime: '3 minute read'
        },
        {
            id: 7,
            title: 'Earth\'s Magnetic Field Reversal Could Happen Sooner Than Expected',
            category: 'Geomagnetism',
            date: 'Mar 9',
            readTime: '5 minute read'
        }
    ];

    return (
        <>
            <Head>
                <title>GeoBit - TLDR for Geoscientists</title>
                <meta name="description" content="A TLDR-style newsletter for geoscientists with the latest research news" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="min-h-screen bg-white">
                <nav className="border-b border-gray-200">
                    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                        <div className="font-bold text-2xl text-gray-900">GeoBit</div>
                        <div className="flex space-x-6">
                            <Link href="/newsletters" className="text-gray-600 hover:text-gray-900">Newsletters</Link>
                            <Link href="/categories" className="text-gray-600 hover:text-gray-900">Categories</Link>
                            <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
                        </div>
                    </div>
                </nav>

                <div className="container mx-auto px-4 py-12">
                    <header className="max-w-3xl mx-auto text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Keep up with geoscience in 5 minutes
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Get the free daily email with concise summaries of the most interesting research and developments in earth sciences
                        </p>

                        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row max-w-lg mx-auto gap-3">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-grow px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your email"
                                required
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200 disabled:opacity-50 whitespace-nowrap"
                            >
                                Subscribe
                            </button>
                        </form>
                        <p className="text-sm text-gray-500 mt-3">
                            Join 50,000+ geoscientists for one daily email
                        </p>
                    </header>

                    <section className="max-w-4xl mx-auto mb-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Featured Articles
                        </h2>

                        <div className="space-y-8">
                            {featuredArticles.map((article) => (
                                <div key={article.id} className="border-b border-gray-200 pb-8">
                                    <div className="flex items-center text-sm text-gray-500 mb-2">
                                        <span>{article.date}</span>
                                        <span className="mx-2">|</span>
                                        <span>{article.category}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                                        {article.title}
                                    </h3>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <FiClock className="mr-1" size={14} />
                                        <span>{article.readTime}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="max-w-4xl mx-auto mb-16">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Recent Articles
                            </h2>
                            <a href="/archive" className="flex items-center text-blue-600 hover:text-blue-800">
                                View all articles
                                <FiArrowRight className="ml-1" size={16} />
                            </a>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {recentArticles.map((article) => (
                                <div key={article.id} className="border-b border-gray-200 pb-6">
                                    <div className="flex items-center text-sm text-gray-500 mb-2">
                                        <span>{article.date}</span>
                                        <span className="mx-2">|</span>
                                        <span>{article.category}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                                        {article.title}
                                    </h3>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <FiClock className="mr-1" size={14} />
                                        <span>{article.readTime}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="max-w-4xl mx-auto mb-16 bg-gray-50 rounded-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Get the GeoBit Newsletter
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Stay informed with the latest geoscience discoveries, trends, and research summaries delivered directly to your inbox.
                        </p>

                        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row max-w-lg gap-3">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-grow px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your email"
                                required
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200 disabled:opacity-50 whitespace-nowrap"
                            >
                                Subscribe
                            </button>
                        </form>
                    </section>

                    <footer className="max-w-4xl mx-auto py-8 border-t border-gray-200 text-center text-gray-500 text-sm">
                        <div className="flex justify-center space-x-6 mb-4">
                            <a href="/privacy" className="hover:text-gray-900">Privacy</a>
                            <a href="/careers" className="hover:text-gray-900">Careers</a>
                            <a href="/advertise" className="hover:text-gray-900">Advertise</a>
                        </div>
                        <p>&copy; {new Date().getFullYear()} GeoBit. All rights reserved.</p>
                    </footer>
                </div>
            </main>
        </>
    );
} 