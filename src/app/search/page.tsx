'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, ArrowLeft, Loader2 } from 'lucide-react';
import FamilyCard from '@/components/FamilyCard';
import SearchSkeleton from '@/components/SearchSkeleton';
import type { Family } from '@/types';

export default function SearchPage() {
  // 🔹 Obtener parámetros de la URL
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';

  // 🔹 Estados
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<Family[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('relevance');

  // 🔹 Función para buscar
  const performSearch = async (searchTerm: string) => {
    if (searchTerm.trim().length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();

      if (data.success) {
        setResults(data.data);
      } else {
        setError(data.error || 'Search failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Buscar cuando cambia el query de la URL
  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [query]);

    // 🔹 Filtrar resultados por categoría
  const filterResults = (families: Family[]) => {
    let filtered = [...families];

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (family) => family.category === selectedCategory
      );
    }

    // Ordenar
    if (sortBy === 'recent') {
      filtered.sort((a, b) => 
        new Date(b.metadata.uploadDate).getTime() - 
        new Date(a.metadata.uploadDate).getTime()
      );
    } else if (sortBy === 'popular') {
      filtered.sort((a, b) => b.metadata.downloads - a.metadata.downloads);
    }
    // 'relevance' ya viene ordenado del API

    return filtered;
  };

  // 🔹 Limpiar filtros
  const clearFilters = () => {
    setSelectedCategory('all');
    setSortBy('relevance');
  };

  // 🔹 Manejar nueva búsqueda
  const handleSearch = () => {
    if (searchQuery.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con search bar */}
      <div className="bg-white border-b sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {/* Back button */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Search families..."
              className="w-full px-6 py-4 pr-32 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none text-base shadow-sm"
              autoFocus
            />
            <button
              onClick={handleSearch}
              disabled={searchQuery.trim().length < 2}
              className="absolute right-2 top-2 px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header de resultados y filtros */}
        {query && (
          <div className="mb-8">
            {/* Título y contador */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Search results for "{query}"
                </h1>
                {!isLoading && (
                  <p className="text-gray-600">
                    {filterResults(results).length} of {results.length} results
                  </p>
                )}
              </div>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-4 items-center">
              {/* Category Filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 pr-10 bg-white border-2 border-gray-200 rounded-lg hover:border-primary focus:border-primary focus:outline-none appearance-none cursor-pointer font-medium"
                >
                  <option value="all">All Categories</option>
                  <option value="furniture">Furniture</option>
                  <option value="doors">Doors</option>
                  <option value="windows">Windows</option>
                  <option value="lighting">Lighting</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Sort Filter */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 pr-10 bg-white border-2 border-gray-200 rounded-lg hover:border-primary focus:border-primary focus:outline-none appearance-none cursor-pointer font-medium"
                >
                  <option value="relevance">Relevance</option>
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Popular</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Clear Filters Button */}
              {(selectedCategory !== 'all' || sortBy !== 'relevance') && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-600 hover:text-primary font-medium transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        )}

{/* Loading state */}
{isLoading && (
  <div>
    {/* Mensaje de búsqueda */}
    <div className="flex items-center gap-3 mb-6">
      <Loader2 className="w-5 h-5 text-primary animate-spin" />
      <p className="text-gray-600">Searching for "{query}"...</p>
    </div>
    
    {/* Skeleton cards */}
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
              onClick={() => performSearch(query)}
              className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && results.length === 0 && query && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No results found for "{query}"
            </h2>
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
                  className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-primary hover:text-primary transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Resultados */}
        {!isLoading && !error && results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterResults(results).map((family) => (
              <FamilyCard key={family.id} family={family} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}