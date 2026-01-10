import { useState, useEffect } from 'react';

/**
 * Debounce hook - Delays value updates until user stops typing
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds (recommended: 300ms)
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}