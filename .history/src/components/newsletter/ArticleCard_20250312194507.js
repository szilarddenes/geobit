import Link from 'next/link';
import { FiClock, FiArrowRight } from 'react-icons/fi';

// Component to display emoji with a category
const CategoryBadge = ({ category, emoji, pixelFont }) => {
  return (
    <div className={`inline-flex items-center text-sm ${pixelFont ? 'font-pixel text-xs' : 'font-medium'} text-primary bg-dark-light rounded-full px-3 py-1`}>
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

const ArticleCard = ({ article, pixelFont = false }) => {
  const { id, title, category, date, readTime, summary, source, url } = article;
  const emoji = getCategoryEmoji(category);
  
  return (
    <article className="bg-dark-card border border-dark-border rounded-lg p-6 transition-shadow hover:shadow-dark-md hover:bg-dark-card-hover">
      <div className="flex flex-col h-full">
        {/* Category */}
        <div className="mb-3">
          <CategoryBadge category={category} emoji={emoji} pixelFont={pixelFont} />
        </div>
        
        {/* Title */}
        <h3 className={`${pixelFont ? 'text-lg font-pixel leading-relaxed' : 'text-xl font-bold'} text-light mb-3 flex-grow`}>
          <Link href={url || `/articles/${id}`} className="hover:text-primary transition-colors">
            {title}
          </Link>
        </h3>
        
        {/* Summary (if provided) */}
        {summary && (
          <p className="text-light-muted mb-4 line-clamp-3">{summary}</p>
        )}
        
        {/* Footer */}
        <div className="mt-auto pt-4 flex items-center justify-between text-sm text-light-muted">
          <div className="flex items-center">
            <FiClock className="mr-1" size={14} />
            <span>{readTime}</span>
          </div>
          <div>
            {source && (
              <span>Source: <span className={pixelFont ? 'font-pixel text-xs' : 'font-medium'}>{source}</span></span>
            )}
          </div>
        </div>
        
        {/* Read More Link */}
        <div className="mt-4 pt-4 border-t border-dark-border">
          <Link
            href={url || `/articles/${id}`}
            className={`inline-flex items-center text-primary ${pixelFont ? 'font-pixel text-xs' : 'font-medium'} hover:opacity-90`}
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
