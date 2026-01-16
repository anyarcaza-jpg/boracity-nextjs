/**
 * useFavorites Hook v3.1
 * Optimized version - less aggressive reloading
 * @version 3.1.0
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import {
  getFavorites as getLocalFavorites,
  addFavorite as addLocalFavorite,
  removeFavorite as removeLocalFavorite,
} from '@/lib/storage/favorites';

interface UseFavoritesReturn {
  favorites: string[];
  toggleFavorite: (familyId: string) => Promise<void>;
  isFavorite: (familyId: string) => boolean;
  favoritesCount: number;
  isLoading: boolean;
}

export function useFavorites(): UseFavoritesReturn {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMigrated, setHasMigrated] = useState(false);

  const loadFavoritesFromAPI = useCallback(async () => {
    try {
      const response = await fetch('/api/user/favorites');
      
      if (response.ok) {
        const data = await response.json();
        return data.favorites || [];
      } else {
        console.error('Failed to load favorites from API');
        return [];
      }
    } catch (error) {
      console.error('Error loading favorites from API:', error);
      return [];
    }
  }, []);

  const migrateLocalFavorites = useCallback(async () => {
    if (hasMigrated) return;

    const localFavorites = getLocalFavorites();
    
    if (localFavorites.length === 0) {
      setHasMigrated(true);
      return;
    }

    try {
      const response = await fetch('/api/user/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          migrate: true,
          familyIds: localFavorites,
        }),
      });

      if (response.ok) {
        console.log('Favorites migrated successfully');
        const freshFavorites = await loadFavoritesFromAPI();
        setFavorites(freshFavorites);
        setHasMigrated(true);
      }
    } catch (error) {
      console.error('Error migrating favorites:', error);
    }
  }, [hasMigrated, loadFavoritesFromAPI]);

  useEffect(() => {
    async function initializeFavorites() {
      if (status === 'loading') {
        return;
      }

      if (session?.user) {
        const favs = await loadFavoritesFromAPI();
        setFavorites(favs);
        await migrateLocalFavorites();
      } else {
        const localFavorites = getLocalFavorites();
        setFavorites(localFavorites);
      }

      setIsLoading(false);
    }

    initializeFavorites();
  }, [session, status, loadFavoritesFromAPI, migrateLocalFavorites]);

  const toggleFavorite = useCallback(async (familyId: string) => {
    if (!familyId) {
      console.error('Invalid family ID');
      return;
    }

    const isCurrentlyFavorite = favorites.includes(familyId);

    if (session?.user) {
      try {
        if (isCurrentlyFavorite) {
          setFavorites((prev) => prev.filter(id => id !== familyId));
          
          const response = await fetch('/api/user/favorites?familyId=' + familyId, {
            method: 'DELETE',
          });

          if (!response.ok) {
            setFavorites((prev) => [...prev, familyId]);
          }
        } else {
          setFavorites((prev) => [...prev, familyId]);
          
          const response = await fetch('/api/user/favorites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ familyId }),
          });

          if (!response.ok) {
            setFavorites((prev) => prev.filter(id => id !== familyId));
          }
        }
      } catch (error) {
        console.error('Error syncing favorite with API:', error);
        if (isCurrentlyFavorite) {
          setFavorites((prev) => [...prev, familyId]);
        } else {
          setFavorites((prev) => prev.filter(id => id !== familyId));
        }
      }
    } else {
      if (isCurrentlyFavorite) {
        removeLocalFavorite(familyId);
        setFavorites((prev) => prev.filter(id => id !== familyId));
      } else {
        addLocalFavorite(familyId);
        setFavorites((prev) => [...prev, familyId]);
      }
    }
  }, [favorites, session]);

  const isFavorite = useCallback((familyId: string): boolean => {
    if (!familyId) {
      return false;
    }
    return favorites.includes(familyId);
  }, [favorites]);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    favoritesCount: favorites.length,
    isLoading,
  };
}