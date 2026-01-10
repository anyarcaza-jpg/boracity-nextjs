import { useEffect, RefObject } from 'react';

/**
 * Click outside hook - Detects clicks outside a component
 * @param ref - Reference to the component element
 * @param handler - Function to execute when clicking outside
 */
export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T>,
  handler: () => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      
      // Do nothing if clicking ref's element or its descendants
      if (!ref.current || ref.current.contains(target)) {
        return;
      }
      
      handler();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}