// src/hooks/useInfiniteScroll.ts
import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  onLoadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
  threshold?: number; // Percentage of page (0-1), default: 0.8 (80%)
  enabled?: boolean;
}

/**
 * Custom hook for infinite scroll functionality
 * 
 * Detects when user scrolls near bottom of page and triggers load more
 * 
 * @param options Configuration options
 * @returns null (hook manages side effects only)
 * 
 * @example
 * useInfiniteScroll({
 *   onLoadMore: () => loadMoreResults(),
 *   isLoading: loading,
 *   hasMore: pagination.hasMore,
 *   threshold: 0.8, // Trigger at 80% of page
 *   enabled: true
 * });
 */
export function useInfiniteScroll({
  onLoadMore,
  isLoading,
  hasMore,
  threshold = 0.8,
  enabled = true
}: UseInfiniteScrollOptions) {
  const observer = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = useCallback(() => {
    if (!enabled || isLoading || !hasMore) return;

    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    // Calculate scroll percentage
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

    // Trigger load more when reaching threshold
    if (scrollPercentage >= threshold) {
      onLoadMore();
    }
  }, [enabled, isLoading, hasMore, threshold, onLoadMore]);

  useEffect(() => {
    if (!enabled) return;

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, enabled]);

  return null;
}