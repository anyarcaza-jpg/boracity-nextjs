import { Family } from '@/types';
import Image from 'next/image';

interface SearchSuggestionProps {
  family: Family;
  isActive: boolean;
  onClick: () => void;
  showThumbnail?: boolean;
}

export default function SearchSuggestion({
  family,
  isActive,
  onClick,
  showThumbnail = true,
}: SearchSuggestionProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full px-4 py-3 flex items-center gap-3 text-left 
        transition-all duration-150 suggestion-item
        ${isActive 
          ? 'bg-primary/10 border-l-4 border-primary shadow-sm scale-[1.02]' 
          : 'hover:bg-gray-50 border-l-4 border-transparent'
        }
      `}
    >
      {/* Thumbnail */}
      {showThumbnail && (
        <div className={`
          w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100
          transition-transform duration-150
          ${isActive ? 'ring-2 ring-primary ring-offset-2' : ''}
        `}>
          <Image
            src={family.images.thumbnail}
            alt={family.name}
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`
          font-medium truncate transition-colors
          ${isActive ? 'text-primary' : 'text-gray-900'}
        `}>
          {family.name}
        </p>
        <p className="text-sm text-gray-500 capitalize">
          {family.category}
        </p>
      </div>

      {/* Downloads badge */}
      <div className={`
        text-xs px-2 py-1 rounded-full transition-colors
        ${isActive 
          ? 'bg-primary/20 text-primary font-medium' 
          : 'text-gray-400'
        }
      `}>
        {family.metadata.downloads.toLocaleString()}
      </div>
      
      {/* Keyboard indicator */}
      {isActive && (
        <div className="text-xs text-primary font-semibold animate-fadeIn">
          ↵
        </div>
      )}
    </button>
  );
}