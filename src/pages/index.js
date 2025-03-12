import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiClock, FiArrowRight, FiArrowDown } from 'react-icons/fi';

export default function Home() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulating API call
    setTimeout(() => {
      alert('Thank you for subscribing!');
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  // Sample geoscience news articles
  const featuredArticles = [
    {
      id: 1,
      title: "New Study Reveals Ancient Sea Levels Were Higher Than Previously Thought",
      category: "Oceanography",
      date: "Mar 12",
      readTime: "3 minute read",
      summary: "Researchers found evidence suggesting sea levels during the last interglacial period were up to 3 meters higher than current estimates.",
      source: "Nature",
    },
    {
      id: 2,
      title: "Discovery of Rare Mineral Formation Challenges Current Volcanic Theories",
      category: "Volcanology",
      date: "Mar 12",
      readTime: "4 minute read",
      summary: "Unusual mineral deposits found in Indonesian volcano may require revisions to our understanding of magma chamber dynamics.",
      source: "Science",
    },
    {
      id: 3,
      title: "Climate Models Underestimated Arctic Ice Loss, New Data Shows",
      category: "Climate Science",
      date: "Mar 11",
      readTime: "5 minute read",
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
      readTime: "6 minute read",
      source: "NASA",
    },
    {
      id: 5,
      title: "Advanced Seismic Monitoring Tool Shows Promise for Earthquake Prediction",
      category: "Seismology",
      date: "Mar 10",
      readTime: "4 minute read",
      source: "USGS",
    },
    {
      id: 6,
      title: "Machine Learning Helps Identify New Mineral Deposits in Remote Locations",
      category: "Economic Geology",
      date: "Mar 10",
      readTime: "3 minute read",
      source: "Mining Journal",
    },
    {
      id: 7,
      title: "Earth's Magnetic Field Reversal Could Happen Sooner Than Expected",
      category: "Geomagnetism",
      date: "Mar 9",
      readTime: "5 minute read",
      source: "Eos",
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>GeoBit - TLDR for Geoscientists</title>
        <meta name="description" content="A TLDR-style newsletter for geoscientists with the latest research and industry news" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header/Navigation */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">
              <span className="text-[#001F3F]">Geo<span className="text-[#FF4D00]">Bit</span></span>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/newsletters" className="text-gray-600 hover:text-gray-900">Newsletters</Link>
              <Link href="/archive" className="text-gray-600 hover:text-gray-900">Archive</Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
              <Link href="/subscribe" className="bg-[#FF4D00] text-white px-4 py-2 rounded font-medium hover:bg-[#E64500]">Subscribe</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Section divider - TLDR.tech style */}
      <div className="section-divider w-full"></div>

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#001F3F] mb-6">
            GEOSCIENCE<br />IN 5 MINUTES DAILY
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Get the <span className="text-[#FF4D00] font-bold">most important</span> earth science research and discoveries in a free daily email.
          </p>

          <form onSubmit={handleSubscribe} className="max-w-md mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF4D00] focus:border-[#FF4D00]"
                placeholder="Enter your email"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-[#FF4D00] hover:bg-[#E64500] text-white font-medium rounded-md transition duration-200 disabled:opacity-50 whitespace-nowrap"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
          </form>
          
          <p className="text-sm text-gray-500">
            No spam. Unsubscribe at any time.
          </p>

          <div className="mt-12">
            <a href="#articles" className="inline-flex items-center text-[#FF4D00] hover:text-[#E64500]">
              Explore articles
              <FiArrowDown className="ml-2 animate-bounce" />
            </a>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section id="articles" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Featured Research</h2>
          
          <div className="space-y-8">
            {featuredArticles.map((article) => (
              <article 
                key={article.id} 
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span>{article.date}</span>
                  <span className="mx-2">|</span>
                  <span className="font-medium">{article.category}</span>
                </div>
                <h3 className="text-xl font-bold text-[#001F3F] mb-3 hover:text-[#FF4D00] transition-colors duration-200">
                  {article.title}
                </h3>
                <p className="text-gray-600 mb-4">{article.summary}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <FiClock className="mr-1" size={14} />
                    <span>{article.readTime}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Source: <span className="font-medium">{article.source}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <Link 
                    href="#" 
                    className="inline-flex items-center text-[#FF4D00] font-medium hover:text-[#E64500]"
                  >
                    Read more
                    <FiArrowRight className="ml-2" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Articles */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Latest Updates</h2>
            <Link 
              href="/archive" 
              className="inline-flex items-center text-[#FF4D00] font-medium hover:text-[#E64500]"
            >
              View all articles
              <FiArrowRight className="ml-2" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {recentArticles.map((article) => (
              <article 
                key={article.id} 
                className="bg-gray-50 p-5 rounded-lg hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span>{article.date}</span>
                  <span className="mx-2">|</span>
                  <span className="font-medium">{article.category}</span>
                </div>
                <h3 className="text-lg font-bold text-[#001F3F] mb-3 hover:text-[#FF4D00] transition-colors duration-200">
                  {article.title}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <FiClock className="mr-1" size={14} />
                    <span>{article.readTime}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Source: <span className="font-medium">{article.source}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-[#001F3F] text-white p-10 rounded-lg max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Never Miss Important Research</h2>
            <p className="mb-6">
              Stay informed with the latest geoscience discoveries, trends, and research summaries delivered directly to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-grow px-4 py-3 border-0 rounded-md text-gray-800 focus:ring-2 focus:ring-[#FFCC00]"
                  placeholder="Enter your email"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-[#FFCC00] hover:bg-[#E6B800] text-[#001F3F] font-medium rounded-md transition duration-200 disabled:opacity-50 whitespace-nowrap"
                >
                  {isSubmitting ? 'Subscribing...' : 'Join Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Section divider */}
      <div className="section-divider w-full"></div>

      {/* Footer */}
      <footer className="bg-[#001F3F] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">GeoBit</div>
              <p className="text-gray-400 mb-6">
                A TLDR-style newsletter for geoscientists with the latest research and industry news.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Newsletters</h3>
              <ul className="space-y-2">
                <li><Link href="/newsletters/research" className="text-gray-400 hover:text-white">Research Highlights</Link></li>
                <li><Link href="/newsletters/industry" className="text-gray-400 hover:text-white">Industry News</Link></li>
                <li><Link href="/newsletters/tools" className="text-gray-400 hover:text-white">Tools & Technology</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link href="/advertise" className="text-gray-400 hover:text-white">Advertise</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} GeoBit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}