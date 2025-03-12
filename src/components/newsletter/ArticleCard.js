import Link from 'next/link';
import { FiClock, FiExternalLink } from 'react-icons/fi';

export default function ArticleCard({ 
  article, 
  featured = false,
  hideImage = false
}) {
  // Determine the appropriate styling based on whether it's featured
  const titleClasses = featured 
    ? 'text-xl md:text-2xl font-bold text-neutral-900 group-hover:text-primary-600 transition duration-150' 
    : 'text-lg font-bold text-neutral-900 group-hover:text-primary-600 transition duration-150';

  const containerClasses = featured
    ? 'border-b border-gray-200 pb-8 mb-8'
    : 'border-b border-gray-200 pb-6';

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
    <div className={containerClasses}>
      <Link href={article.url || '#'} className="group block">
        <div className="flex items-center text-sm text-neutral-500 mb-2">
          <span>{article.date}</span>
          <span className="mx-2">|</span>
          <span>
            {categoryEmoji} {article.category}
          </span>
        </div>
        
        {!hideImage && article.imageUrl && (
          <div className="mb-3 overflow-hidden rounded-lg">
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        
        <h3 className={titleClasses}>
          {article.title}
        </h3>
        
        {article.summary && (
          <p className="text-neutral-600 mt-2 mb-3 text-base line-clamp-2">
            {article.summary}
          </p>
        )}
        
        <div className="flex items-center text-sm text-neutral-500">
          <FiClock className="mr-1" size={14} />
          <span>{article.readTime}</span>
          
          {article.source && (
            <>
              <span className="mx-2">|</span>
              <span className="flex items-center">
                {article.source}
                <FiExternalLink className="ml-1" size={14} />
              </span>
            </>
          )}
        </div>
      </Link>
    </div>
  );
}