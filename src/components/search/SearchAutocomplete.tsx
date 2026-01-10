'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { useClickOutside } from '@/hooks/useClickOutside';
import { SearchHistory } from '@/lib/searchHistory';
import SearchSuggestion from './SearchSuggestion';
import SearchRecent from './SearchRecent';
import type { Family } from '@/types';

interface SearchAutocompleteProps {
  placeholder?: string;
  autoFocus?: boolean;
}

export default function SearchAutocomplete({
  placeholder = 'Search families (e.g., office chair, door, window...)',
  autoFocus = false,
}: SearchAutocompleteProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null!);
  const inputRef = useRef<HTMLInputElement>(null!);

  // States
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Family[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Debounce query for API calls
  const debouncedQuery = useDebounce(query, 300);

  // Close dropdown when clicking outside
  useClickOutside(containerRef, () => setIsOpen(false));

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(SearchHistory.getHistory());
  }, []);

  // Fetch suggestions when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      fetchSuggestions(debouncedQuery);
    } else {
      setSuggestions([]);
      setSelectedIndex(-1);
    }
  }, [debouncedQuery]);

  /**
   * Fetch suggestions from API
   */
  const fetchSuggestions = async (searchTerm: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchTerm)}`
      );
      const data = await response.json();

      if (data.success) {
        setSuggestions(data.data.slice(0, 8));
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle search execution
   */
  const executeSearch = (searchTerm: string) => {
    const trimmed = searchTerm.trim();
    if (trimmed.length < 2) return;

    SearchHistory.addSearch(trimmed);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    setIsOpen(false);
    setQuery('');
  };

  /**
   * Handle suggestion selection
   */
  const handleSelectSuggestion = (family: Family) => {
    executeSearch(family.name);
  };

  /**
   * Handle recent search selection
   */
  const handleSelectRecent = (search: string) => {
    setQuery(search);
    executeSearch(search);
  };

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'Enter') {
        executeSearch(query);
      }
      return;
    }

    const items = suggestions.length > 0 ? suggestions : [];
    const maxIndex = items.length - 1;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < maxIndex ? prev + 1 : prev
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : -1
        );
        break;

      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelectSuggestion(suggestions[selectedIndex]);
        } else {
          executeSearch(query);
        }
        break;

      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  /**
   * Handle input change
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  /**
   * Handle input focus
   */
  const handleFocus = () => {
    setIsOpen(true);
  };

  /**
   * Clear input
   */
  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  /**
   * Clear history
   */
  const handleClearHistory = () => {
    SearchHistory.clearHistory();
    setRecentSearches([]);
  };

  /**
   * Remove individual search from history
   */
  const handleRemoveSearch = (search: string) => {
    SearchHistory.removeItem(search);
    setRecentSearches(SearchHistory.getHistory());
  };

  const showRecent = isOpen && query.trim().length === 0 && recentSearches.length > 0;
  const showSuggestions = isOpen && query.trim().length >= 2 && suggestions.length > 0;
  const showDropdown = showRecent || showSuggestions || (isOpen && query.trim().length >= 2 && !isLoading);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input Field */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full px-6 py-4 pr-32 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none text-base shadow-sm transition-colors"
        />

        {query && (
          <button
            onClick={handleClear}
            className="absolute right-24 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={() => executeSearch(query)}
          disabled={query.trim().length < 2}
          className="absolute right-2 top-2 px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
      </div>

      {/* Dropdown - RESPONSIVE + ANIMATED */}
      {showDropdown && (
        <>
          {/* Mobile overlay */}
          <div 
            className="fixed inset-0 bg-black/20 z-40 md:hidden animate-fadeIn"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
         <div className="
            /* Position */
            fixed md:absolute
            bottom-26 md:bottom-auto
            md:top-full left-0 right-0 md:mt-2
  
            /* Size */
            w-full md:w-auto
            max-h-[55vh] md:max-h-96
            pb-safe
            
            /* Style */
            bg-white 
            rounded-t-2xl md:rounded-lg
            shadow-xl 
            border-t-4 md:border-2 border-gray-200 border-t-gray-300
            
            /* Behavior */
            overflow-y-auto z-50
            
            /* Animation */
            animate-slideUp md:animate-slideDown
          ">
            {/* Mobile handle (drag indicator) */}
            <div className="md:hidden flex justify-center pt-3 pb-2 sticky top-0 bg-white z-10">
              <div className="w-12 h-1 bg-gray-300 rounded-full" />
            </div>
          
            {/* Recent Searches */}
            {showRecent && (
              <SearchRecent
                searches={recentSearches}
                onSelect={handleSelectRecent}
                onClear={handleClearHistory}
                onRemove={handleRemoveSearch}
              />
            )}

            {/* Loading State */}
            {isLoading && query.trim().length >= 2 && (
              <div className="px-4 py-8 text-center">
                <div className="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-500 mt-2">Searching...</p>
              </div>
            )}

            {/* Suggestions */}
            {showSuggestions && !isLoading && (
              <div>
                {suggestions.map((family, index) => (
                  <SearchSuggestion
                    key={family.id}
                    family={family}
                    isActive={index === selectedIndex}
                    onClick={() => handleSelectSuggestion(family)}
                    showThumbnail={true}
                  />
                ))}
              </div>
            )}

            {/* No Results */}
            {!isLoading && query.trim().length >= 2 && suggestions.length === 0 && (
              <div className="px-4 py-8 text-center">
                <p className="text-gray-500">No suggestions found</p>
                <p className="text-sm text-gray-400 mt-1">
                  Try a different search term
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}