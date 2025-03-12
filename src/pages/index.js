import { useState, useEffect } from 'react';
import { FiArrowRight, FiArrowDown } from 'react-icons/fi';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import ArticleCard from '@/components/newsletter/ArticleCard';
import SubscriptionForm from '@/components/newsletter/SubscriptionForm';

export default function Home() {
  const [animatedItems, setAnimatedItems] = useState([]);
  
  // Animation on scroll effect
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setAnimatedItems(prev => [...prev, entry.target.getAttribute('data-animate-id')]);
        }
      });
    }, { threshold: 0.1 });
    
    const elements = document.querySelectorAll('[data-animate-id]');
    elements.forEach(el => observer.observe(el));
    
    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, []);
  
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
      url: "/article/oceanography-sea-levels"
    },
    {
      id: 2,
      title: "Discovery of Rare Mineral Formation Challenges Current Volcanic Theories",
      category: "Volcanology",
      date: "Mar 12",
      readTime: "4 minute read",
      summary: "Unusual mineral deposits found in Indonesian volcano may require revisions to our understanding of magma chamber dynamics.",
      source: "Science",
      url: "/article/volcanology-mineral-formation"
    },
    {
      id: 3,
      title: "Climate Models Underestimated Arctic Ice Loss, New Data Shows",
      category: "Climate Science",
      date: "Mar 11",
      readTime: "5 minute read",
      summary: "Satellite measurements reveal Arctic ice is melting at rates faster than predicted by leading climate models, raising concerns about feedback loops.",
      source: "Geophysical Research Letters",
      url: "/article/climate-arctic-ice"
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
      url: "/article/mars-water-reservoir"
    },
    {
      id: 5,
      title: "Advanced Seismic Monitoring Tool Shows Promise for Earthquake Prediction",
      category: "Seismology",
      date: "Mar 10",
      readTime: "4 minute read",
      source: "USGS",
      url: "/article/seismic-monitoring-tool"
    },
    {
      id: 6,
      title: "Machine Learning Helps Identify New Mineral Deposits in Remote Locations",
      category: "Economic Geology",
      date: "Mar 10",
      readTime: "3 minute read",
      source: "Mining Journal",
      url: "/article/machine-learning-mineral-deposits"
    },
    {
      id: 7,
      title: "Earth's Magnetic Field Reversal Could Happen Sooner Than Expected",
      category: "Geomagnetism",
      date: "Mar 9",
      readTime: "5 minute read",
      source: "Eos",
      url: "/article/magnetic-field-reversal"
    }
  ];

  const isAnimated = (id) => animatedItems.includes(id);

  return (
    <Layout>
      {/* Hero Section with Diadora-style design */}
      <div className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background geometric shapes */}
        <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-accent opacity-10 -rotate-12 transform translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/3 bg-primary opacity-5 rotate-12 transform -translate-x-1/4 translate-y-1/4"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-heading text-5xl md:text-7xl text-secondary uppercase font-bold mb-6 tracking-tight text-center leading-none">
              <span className="relative inline-block">Geo</span>
              <span className="relative inline-block text-primary">Science</span>
              <br />
              <span className="text-4xl md:text-5xl">in 5 minutes daily</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-neutral-600 mb-12 text-center max-w-3xl mx-auto">
              Get the <span className="highlight">most important</span> earth science research and discoveries in a free daily email.
            </p>

            <div className="max-w-lg mx-auto mb-10">
              <SubscriptionForm />
            </div>
            
            <div className="text-center">
              <a 
                href="#featured" 
                className="inline-flex items-center justify-center text-primary hover:text-primary-700 font-bold transition-all duration-300"
              >
                <span className="mr-2 uppercase">Explore articles</span>
                <FiArrowDown className="animate-bounce" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Colorful section divider */}
        <div className="section-divider absolute bottom-0 left-0 w-full"></div>
      </div>

      {/* Featured Section */}
      <section 
        id="featured" 
        className="py-20 bg-white relative"
        data-animate-id="featured-section"
      >
        <div className="container mx-auto px-4">
          <div className={`mb-12 transition-all duration-1000 transform ${
            isAnimated('featured-section') ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h2 className="font-heading text-4xl text-secondary uppercase font-bold mb-2 tracking-tight">
              Featured Research
            </h2>
            <div className="h-1 w-24 bg-primary mb-8"></div>
            <p className="text-xl text-neutral-600 max-w-3xl">
              The most significant earth science discoveries and breakthroughs you should know about.
            </p>
          </div>

          <div className="space-y-16">
            {featuredArticles.map((article, index) => (
              <div 
                key={article.id}
                data-animate-id={`featured-${index}`}
                className={`transition-all duration-1000 delay-${index * 200} transform ${
                  isAnimated(`featured-${index}`) ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                }`}
              >
                <ArticleCard article={article} featured={true} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Articles Section */}
      <section className="py-20 bg-neutral-50 relative">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="font-heading text-4xl text-secondary uppercase font-bold mb-2 tracking-tight">
                Latest Updates
              </h2>
              <div className="h-1 w-24 bg-accent"></div>
            </div>
            
            <Link 
              href="/archive" 
              className="btn btn-outline flex items-center group"
            >
              View All Articles
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
            {recentArticles.map((article, index) => (
              <div 
                key={article.id}
                data-animate-id={`recent-${index}`}
                className={`transition-all duration-1000 delay-${index * 150} transform ${
                  isAnimated(`recent-${index}`) ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        </div>
        
        {/* Diagonal section divider */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white transform -skew-y-2 translate-y-8"></div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-secondary text-white p-12 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary opacity-30 rotate-45 transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent opacity-20 rotate-45 transform -translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative z-10 text-center">
              <h2 className="font-heading text-4xl uppercase font-bold mb-6 tracking-tight">
                Never Miss <span className="text-accent">Important</span> Research
              </h2>
              
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Stay informed with the latest geoscience discoveries, trends, and research summaries delivered directly to your inbox.
              </p>

              <div className="max-w-md mx-auto">
                <SubscriptionForm buttonText="Join Now" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}