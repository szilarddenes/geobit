import Link from 'next/link';
import { FiClock, FiExternalLink, FiArrowRight } from 'react-icons/fi';

export default function ArticleCard({ 
  article, 
  featured = false,
  hideImage = false
}) {
  // Determine the appropriate styling based on whether it's featured
  const titleClasses = featured 
    ? 'font-heading text-3xl uppercase text-secondary group-hover:text-primary font-bold tracking-tight transition-all duration-300' 
    : 'font-heading text-xl uppercase text-secondary group-hover:text-primary font-bold tracking-tight transition-all duration-300';

  // Map category to emoji (like TLDR.tech does)
  const categoryEmojis = {
    'Oceanography': '🌊',
    'Volcanology': '🌋',
    'Climate Science': '🌡️',
    'Planetary Science': '🪐',
    'Seismology': '📈',
    'Economic Geology': '💎',
    'Geomagnetism': '🧲',
    'Paleontology': '🦖',
    'Geochemistry': '⚗️',
    'Geophysics': '🔭',
    'Hydrogeology': '💧',
    'Remote Sensing': '🛰️',
    'Petrology': '🪨',
    'Mineralogy': '🔍',
    'Structural Geology': '⛰️',
    'Geomorphology': '🏔️',
    'Stratigraphy': '📑',
    'Geohazards': '⚠️',
    'Soil Science': '🌱',
  };

  // Get emoji for category or use a default
  const categoryEmoji = categoryEmojis[article.category] || '🔬';

  return (
    <div className={`card group relative ${featured ? 'mb-12' : 'mb-6'}`}>
      <Link href={article.url || '#'} className="block">
        {!hideImage && article.imageUrl && (
          <div className="mb-6 overflow-hidden image-zoom">
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="w-full h-64 object-cover"
            />
          </div>
        )}
        
        {/* Category tag */}
        <div className="absolute top-0 left-0 bg-primary text-white text-xs font-bold uppercase px-4 py-1 flex items-center">
          <span className="mr-2">{categoryEmoji}</span>
          <span>{article.category}</span>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between text-sm text-neutral-500 mb-3">
            <span className="uppercase font-bold">{article.date}</span>
            <div className="flex items-center">
              <FiClock className="mr-1" size={14} />
              <span>{article.readTime}</span>
            </div>
          </div>
          
          <h3 className={titleClasses}>
            {article.title}
          </h3>
          
          {article.summary && (
            <p className="text-neutral-600 mt-4 mb-4 line-clamp-3">
              {article.summary}
            </p>
          )}
          
          <div className="flex items-center justify-between mt-6">
            {article.source && (
              <span className="text-sm text-secondary flex items-center">
                <span className="uppercase font-bold">Source:</span>
                <span className="ml-2">{article.source}</span>
                <FiExternalLink className="ml-1" size={14} />
              </span>
            )}
            
            <span className="text-primary font-bold flex items-center group-hover:translate-x-1 transition-transform duration-300">
              Read More
              <FiArrowRight className="ml-2" />
            </span>
          </div>
        </div>
      </Link>
      
      {/* Geometric accent line at bottom */}
      <div className="h-1 w-full bg-accent absolute bottom-0 left-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
    </div>
  );
}