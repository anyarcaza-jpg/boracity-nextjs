import { Clock, X } from 'lucide-react';

interface SearchRecentProps {
  searches: string[];
  onSelect: (search: string) => void;
  onClear: () => void;
  onRemove?: (search: string) => void;
}

export default function SearchRecent({
  searches,
  onSelect,
  onClear,
  onRemove,
}: SearchRecentProps) {
  if (searches.length === 0) return null;

  return (
    <div>
      {/* Header */}
      <div className="px-4 py-2 flex items-center justify-between border-b border-gray-100 bg-gray-50">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Recent Searches
        </span>
        <button
          onClick={onClear}
          className="text-xs text-primary hover:text-primary-dark transition-colors font-medium"
        >
          Clear all
        </button>
      </div>

      {/* Recent search items */}
      <div>
        {searches.map((search, index) => (
          <div
            key={index}
            className="group flex items-center hover:bg-gray-50 transition-colors"
          >
            <button
              onClick={() => onSelect(search)}
              className="flex-1 px-4 py-3 flex items-center gap-3 text-left"
            >
              <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-700 truncate">{search}</span>
            </button>

            {/* Optional: Remove individual item */}
            {onRemove && (
              <button
                onClick={() => onRemove(search)}
                className="px-3 py-3 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove from history"
              >
                <X className="w-3 h-3 text-gray-400 hover:text-red-500 transition-colors" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}