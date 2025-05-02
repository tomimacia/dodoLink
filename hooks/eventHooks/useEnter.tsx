import { KeyboardEvent, RefObject } from 'react';

export const useEnter = (
  ref: RefObject<HTMLInputElement | null>,
  callback: (event: KeyboardEvent<HTMLInputElement>) => void
) => {
  return (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && ref.current === document.activeElement) {
      callback(event);
    }
  };
};
