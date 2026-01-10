/**
 * Search History Manager - Manages recent searches in localStorage
 */

const STORAGE_KEY = 'boracity_search_history';
const MAX_ITEMS = 5;

export class SearchHistory {
  /**
   * Get search history from localStorage
   */
  static getHistory(): string[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading search history:', error);
      return [];
    }
  }

  /**
   * Add a new search to history (max 5 items)
   */
  static addSearch(query: string): void {
    if (typeof window === 'undefined') return;
    if (!query || query.trim().length < 2) return;

    try {
      const history = this.getHistory();
      const normalizedQuery = query.trim().toLowerCase();

      // Remove if already exists
      const filtered = history.filter(
        item => item.toLowerCase() !== normalizedQuery
      );

      // Add to beginning
      const updated = [query.trim(), ...filtered].slice(0, MAX_ITEMS);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }

  /**
   * Clear all search history
   */
  static clearHistory(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  }

  /**
   * Remove a specific item from history
   */
  static removeItem(query: string): void {
    if (typeof window === 'undefined') return;

    try {
      const history = this.getHistory();
      const updated = history.filter(
        item => item.toLowerCase() !== query.toLowerCase()
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error removing search item:', error);
    }
  }
}