import Link from 'next/link';
import { FiClock, FiArrowRight } from 'react-icons/fi';

// Component to display emoji with a category
const CategoryBadge = ({ category, emoji }) => {
  return (
    <div className="inline-flex items-center text-sm font-medium text-gray-800 bg-gray-100 rounded-full px-3 py-1">
      <span className="mr-1">{emoji}</span>
      <span>{category}</span>
    </div>
  );
};

// Get emoji for category
const getCategoryEmoji = (category) => {
  const emojiMap = {
    'Oceanography': '🌊',
    'Climate Science': '🌡️',
    'Volcanology': '🌋',
    'Seismology': '📈',
    'Planetary Science': '🪐',
    'Economic Geology': '💎',
    'Geomagnetism': '🧲',
    'Hydrology': '💧'
  };
  
  return emojiMap[category] || '🌍';
};

const ArticleCard = ({ article }) => {
  const { id, title, category, date, readTime, summary, source, url } = article;
  const emoji = getCategoryEmoji(category);
  
  return (
    <article className="bg-white border border-gray-200 rounded-lg p-6 transition-shadow hover:shadow-md">
      <div className="flex flex-col h-full">
        {/* Category */}
        <div className="mb-3">
          <CategoryBadge category={category} emoji={emoji} />
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 flex-grow">
          <Link href={url || `/articles/${id}`} className="hover:text-blue-600 transition-colors">
            {title}
          </Link>
        </h3>
        
        {/* Summary (if provided) */}
        {summary && (
          <p className="text-gray-600 mb-4 line-clamp-3">{summary}</p>
        )}
        
        {/* Footer */}
        <div className="mt-auto pt-4 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <FiClock className="mr-1" size={14} />
            <span>{readTime}</span>
          </div>
          <div>
            {source && (
              <span>Source: <span className="font-medium">{source}</span></span>
            )}
          </div>
        </div>
        
        {/* Read More Link */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link
            href={url || `/articles/${id}`}
            className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700"
          >
            Read more
            <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
