import { useEffect, useRef, RefObject } from 'react';

export const useClickOutside = (
  handler: () => void
): RefObject<HTMLDivElement> => {
  const domNode = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const maybeHandler = (e: MouseEvent) => {
      if (domNode.current && !domNode.current.contains(e.target as Node)) {
        handler();
      }
    };

    document.addEventListener('mousedown', maybeHandler);

    return () => {
      document.removeEventListener('mousedown', maybeHandler);
    };
  }, [handler]);

  return domNode;
};
