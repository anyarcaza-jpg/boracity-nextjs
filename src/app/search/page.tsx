'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, ArrowLeft, Loader2, X, ChevronDown } from 'lucide-react';
import FamilyCard from '@/components/FamilyCard';
import SearchSkeleton from '@/components/SearchSkeleton';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import type { Family } from '@/types';

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  totalPages: number;
}

interface SearchResponse {
  success: boolean;
  data: Family[];
  pagination: PaginationInfo;
  query: string;
  tags?: string[];
  error?: string; // AGREGAR ESTA LÍNEA
}

// Configuration for infinite scroll behavior
const SCROLL_CONFIG = {
  initialLoad: 20,        // First page size
  scrollLoadSize: 20,     // Load 20 more each scroll
  scrollThreshold: 0.8,   // Trigger at 80% of page
  maxAutoLoad: 100,       // Max 100 auto-loaded (5 pages)
  manualLoadSize: 20,     // Size for manual "Load More"
};

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const tagsParam = searchParams.get('tags') || '';

  // States
  const [searchQuery, setSearchQuery] = useState(query);
  const [allResults, setAllResults] = useState<Family[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [selectedTags, setSelectedTags] = useState<string[]>(
    tagsParam ? tagsParam.split(',').filter(t => t.length > 0) : []
  );
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);
  
  // Pagination state
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: SCROLL_CONFIG.initialLoad,
    hasMore: false,
    totalPages: 0
  });
  
  // Control infinite scroll vs manual load more
  const [autoLoadEnabled, setAutoLoadEnabled] = useState(true);
  const [totalLoaded, setTotalLoaded] = useState(0);

  /**
   * Load available tags from API
   */
  const loadAvailableTags = async () => {
    try {
      const response = await fetch('/api/tags');
      const data = await response.json();
      
      if (data.success) {
        setAvailableTags(data.tags);
      }
    } catch (err) {
      console.error('Error loading tags:', err);
    } finally {
      setIsLoadingTags(false);
    }
  };

  /**
   * Perform search with pagination
   */
  const performSearch = async (
    searchTerm: string, 
    tags: string[] = [], 
    page: number = 1,
    append: boolean = false
  ) => {
    if (searchTerm.trim().length < 2) {
      setAllResults([]);
      return;
    }

    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
      setAllResults([]);
      setPagination({
        total: 0,
        page: 1,
        limit: SCROLL_CONFIG.initialLoad,
        hasMore: false,
        totalPages: 0
      });
      setTotalLoaded(0);
      setAutoLoadEnabled(true);
    }
    
    setError('');

    try {
      let url = `/api/search?q=${encodeURIComponent(searchTerm)}&page=${page}&limit=${SCROLL_CONFIG.scrollLoadSize}`;
      if (tags.length > 0) {
        url += `&tags=${tags.join(',')}`;
      }

      const response = await fetch(url);
      const data: SearchResponse = await response.json();

      if (data.success) {
        if (append) {
          setAllResults(prev => [...prev, ...data.data]);
          setTotalLoaded(prev => prev + data.data.length);
        } else {
          setAllResults(data.data);
          setTotalLoaded(data.data.length);
        }
        
        setPagination(data.pagination);

        // Disable auto-load after reaching max
        if (totalLoaded + data.data.length >= SCROLL_CONFIG.maxAutoLoad) {
          setAutoLoadEnabled(false);
        }
      } else {
        setError(data.error || 'Search failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  /**
   * Load next page (for infinite scroll)
   */
  const loadNextPage = useCallback(() => {
    if (isLoadingMore || !pagination.hasMore) return;
    
    performSearch(query, selectedTags, pagination.page + 1, true);
  }, [query, selectedTags, pagination, isLoadingMore]);

  /**
   * Manual load more (button click)
   */
  const handleManualLoadMore = () => {
    setAutoLoadEnabled(true); // Re-enable auto-load for next batch
    loadNextPage();
  };

  /**
   * Infinite scroll hook
   */
  useInfiniteScroll({
    onLoadMore: loadNextPage,
    isLoading: isLoadingMore,
    hasMore: pagination.hasMore && autoLoadEnabled,
    threshold: SCROLL_CONFIG.scrollThreshold,
    enabled: autoLoadEnabled && !isLoading
  });

  /**
   * Update URL with current filters
   */
  const updateURL = (newQuery?: string, newTags?: string[]) => {
    const q = newQuery !== undefined ? newQuery : searchQuery;
    const tags = newTags !== undefined ? newTags : selectedTags;
    
    let url = `/search?q=${encodeURIComponent(q)}`;
    if (tags.length > 0) {
      url += `&tags=${tags.join(',')}`;
    }
    
    router.push(url);
  };

  /**
   * Toggle tag selection
   */
  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(newTags);
    updateURL(undefined, newTags);
  };

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    setSelectedCategory('all');
    setSortBy('relevance');
    setSelectedTags([]);
    updateURL(undefined, []);
  };

  /**
   * Filter results by category (client-side)
   */
  const filterResults = (families: Family[]) => {
    let filtered = [...families];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (family) => family.category === selectedCategory
      );
    }

    if (sortBy === 'recent') {
      filtered.sort((a, b) => 
        new Date(b.metadata.uploadDate).getTime() - 
        new Date(a.metadata.uploadDate).getTime()
      );
    } else if (sortBy === 'popular') {
      filtered.sort((a, b) => b.metadata.downloads - a.metadata.downloads);
    }

    return filtered;
  };

  /**
   * Handle search button click
   */
  const handleSearch = () => {
    if (searchQuery.trim().length >= 2) {
      updateURL(searchQuery, selectedTags);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  /**
   * Load tags on mount
   */
  useEffect(() => {
    loadAvailableTags();
  }, []);

  /**
   * Perform search when URL changes
   */
  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      performSearch(query, selectedTags, 1, false);
    }
  }, [query, tagsParam]);

  const filteredResults = filterResults(allResults);
  const hasActiveFilters = selectedCategory !== 'all' || sortBy !== 'relevance' || selectedTags.length > 0;
  const showManualLoadMore = !autoLoadEnabled && pagination.hasMore;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with search bar */}
      <div className="bg-white border-b sticky top-16 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Search families..."
              className="w-full px-6 py-4 pr-32 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-base shadow-sm transition-all"
              autoFocus
            />
            <button
              onClick={handleSearch}
              disabled={searchQuery.trim().length < 2}
              className="absolute right-2 top-2 px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Results header and filters */}
        {query && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Search results for "{query}"
                </h1>
                {!isLoading && (
                  <p className="text-gray-600">
                    Showing {filteredResults.length} of {pagination.total} results
                    {selectedTags.length > 0 && ` with ${selectedTags.length} tag${selectedTags.length > 1 ? 's' : ''}`}
                  </p>
                )}
              </div>
            </div>

            {/* Filters section */}
            <div className="space-y-4">
              
              {/* Category and Sort filters */}
              <div className="flex flex-wrap gap-4 items-center">
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2.5 pr-10 bg-white border-2 border-gray-200 rounded-xl hover:border-primary focus:border-primary focus:outline-none appearance-none cursor-pointer font-medium text-sm shadow-sm transition-all"
                  >
                    <option value="all">All Categories</option>
                    <option value="furniture">Furniture</option>
                    <option value="doors">Doors</option>
                    <option value="windows">Windows</option>
                    <option value="lighting">Lighting</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2.5 pr-10 bg-white border-2 border-gray-200 rounded-xl hover:border-primary focus:border-primary focus:outline-none appearance-none cursor-pointer font-medium text-sm shadow-sm transition-all"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="recent">Most Recent</option>
                    <option value="popular">Most Popular</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2.5 text-gray-600 hover:text-primary font-medium transition-colors text-sm"
                  >
                    Clear all filters
                  </button>
                )}
              </div>

              {/* Tags filter */}
              {!isLoadingTags && availableTags.length > 0 && (
                <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-semibold text-gray-700">Filter by tags:</span>
                    {selectedTags.length > 0 && (
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
                        {selectedTags.length} selected
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`
                            px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                            ${isSelected 
                              ? 'bg-primary text-white border-2 border-primary shadow-sm' 
                              : 'bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-primary hover:bg-white'
                            }
                          `}
                        >
                          {tag}
                          {isSelected && (
                            <X className="inline-block w-3 h-3 ml-1" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {isLoadingTags && (
                <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Loading tags...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loading state (initial) */}
        {isLoading && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
              <p className="text-gray-600">Searching for "{query}"...</p>
            </div>
            <SearchSkeleton />
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => performSearch(query, selectedTags, 1, false)}
              className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all shadow-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && allResults.length === 0 && query && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No results found for "{query}"
            </h2>
            {selectedTags.length > 0 && (
              <p className="text-gray-600 mb-4">
                Try removing some tag filters
              </p>
            )}
            <p className="text-gray-600 mb-6">
              Try searching for:
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {['chair', 'door', 'window', 'light'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setSearchQuery(suggestion);
                    router.push(`/search?q=${suggestion}`);
                  }}
                  className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl hover:border-primary hover:text-primary transition-all shadow-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results grid */}
        {!isLoading && !error && filteredResults.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResults.map((family) => (
                <FamilyCard key={family.id} family={family} />
              ))}
            </div>

            {/* Loading more indicator */}
            {isLoadingMore && (
              <div className="flex justify-center items-center py-12">
                <div className="flex items-center gap-3 text-gray-600">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading more results...</span>
                </div>
              </div>
            )}

            {/* Manual Load More button */}
            {showManualLoadMore && !isLoadingMore && (
              <div className="flex justify-center py-12">
                <button
                  onClick={handleManualLoadMore}
                  className="px-8 py-4 bg-white text-primary border-2 border-primary rounded-xl hover:bg-primary hover:text-white transition-all font-semibold shadow-sm flex items-center gap-2"
                >
                  Load More Results
                  <span className="text-sm font-normal">
                    ({pagination.total - totalLoaded} remaining)
                  </span>
                </button>
              </div>
            )}

            {/* End of results */}
            {!pagination.hasMore && allResults.length > 0 && (
              <div className="text-center py-12 text-gray-500">
                <p>You've reached the end of results</p>
              </div>
            )}
          </>
        )}

        {/* No results after filtering */}
        {!isLoading && !error && allResults.length > 0 && filteredResults.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No results match your filters
            </h2>
            <p className="text-gray-600 mb-6">
              Try adjusting your category or sort options
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all shadow-sm"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading search...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}