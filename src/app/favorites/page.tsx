'use client';

import { useEffect, useState } from 'react';
import { Heart, Search, Loader2 } from 'lucide-react';
import FamilyCard from '@/components/FamilyCard';
import { useFavorites } from '@/hooks/useFavorites';
import type { Family } from '@/types';

export default function FavoritesPage() {
  const { favorites, favoritesCount, isLoading: favoritesLoading } = useFavorites();
  const [families, setFamilies] = useState<Family[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadFavorites() {
      if (favoritesLoading) return;
      
      if (favorites.length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        const idsParam = favorites.join(',');
        const response = await fetch('/api/families?ids=' + idsParam);
        
        if (!response.ok) {
          throw new Error('Failed to fetch families');
        }

        const data = await response.json();
        setFamilies(data.families || []);
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadFavorites();
  }, [favorites, favoritesLoading]);

  const filteredFamilies = families.filter(family => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    const name = family.name ? family.name.toLowerCase() : '';
    const description = family.description ? family.description.toLowerCase() : '';
    
    return name.includes(query) || description.includes(query);
  });

  if (isLoading || favoritesLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
            <h1 className="text-4xl font-bold text-gray-900">
              My Favorites
            </h1>
            <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
              {favoritesCount}
            </span>
          </div>
          <p className="text-gray-600">
            {favoritesCount === 0 
              ? 'You have not saved any families yet. Start exploring and save your favorites!' 
              : 'You have ' + favoritesCount + ' favorite ' + (favoritesCount === 1 ? 'family' : 'families')
            }
          </p>
        </div>

        {favoritesCount > 0 && (
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search in favorites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>
        )}

        {favoritesCount === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              No favorites yet
            </h2>
            <p className="text-gray-600 mb-8 text-center max-w-md">
              Start exploring our Revit families collection and save your favorites by clicking the heart icon on any family card.
            </p>
            <a
              href="/search"
              className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors"
            >
              Explore Families
            </a>
          </div>
        ) : filteredFamilies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              No results found
            </h2>
            <p className="text-gray-600 mb-8 text-center max-w-md">
              No families match your search query. Try different keywords.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFamilies.map((family) => (
              <FamilyCard key={family.id} family={family} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}