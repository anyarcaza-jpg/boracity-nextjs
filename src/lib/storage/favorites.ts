/**
 * Favorites Storage Helper
 * Handles all localStorage operations for favorites management
 * @version 1.0.0
 */

const STORAGE_KEY = 'boracity_favorites';

/**
 * Check if localStorage is available
 */
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Get all favorite IDs from localStorage
 * @returns Array of family IDs
 */
export function getFavorites(): string[] {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available');
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);
    
    if (!Array.isArray(parsed)) {
      console.error('Invalid favorites data structure');
      return [];
    }

    return parsed.filter(id => typeof id === 'string' && id.length > 0);
  } catch (error) {
    console.error('Error reading favorites from localStorage:', error);
    return [];
  }
}

/**
 * Save favorites array to localStorage
 * @param favorites - Array of family IDs
 * @returns boolean indicating success
 */
export function saveFavorites(favorites: string[]): boolean {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available');
    return false;
  }

  try {
    const uniqueFavorites = Array.from(new Set(favorites));
    const validFavorites = uniqueFavorites.filter(
      id => typeof id === 'string' && id.length > 0
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(validFavorites));
    return true;
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
    return false;
  }
}

/**
 * Add a family ID to favorites
 * @param familyId - Family UUID to add
 * @returns boolean indicating success
 */
export function addFavorite(familyId: string): boolean {
  if (!familyId || typeof familyId !== 'string') {
    console.error('Invalid family ID');
    return false;
  }

  const currentFavorites = getFavorites();
  
  if (currentFavorites.includes(familyId)) {
    return true;
  }

  const updatedFavorites = [...currentFavorites, familyId];
  return saveFavorites(updatedFavorites);
}

/**
 * Remove a family ID from favorites
 * @param familyId - Family UUID to remove
 * @returns boolean indicating success
 */
export function removeFavorite(familyId: string): boolean {
  if (!familyId || typeof familyId !== 'string') {
    console.error('Invalid family ID');
    return false;
  }

  const currentFavorites = getFavorites();
  const updatedFavorites = currentFavorites.filter(id => id !== familyId);
  
  return saveFavorites(updatedFavorites);
}

/**
 * Check if a family is in favorites
 * @param familyId - Family UUID to check
 * @returns boolean indicating if family is favorited
 */
export function isFavorite(familyId: string): boolean {
  if (!familyId || typeof familyId !== 'string') {
    return false;
  }

  const currentFavorites = getFavorites();
  return currentFavorites.includes(familyId);
}

/**
 * Get the count of favorites
 * @returns number of favorited families
 */
export function getFavoritesCount(): number {
  const favorites = getFavorites();
  return favorites.length;
}

/**
 * Clear all favorites
 * @returns boolean indicating success
 */
export function clearFavorites(): boolean {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available');
    return false;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing favorites:', error);
    return false;
  }
}