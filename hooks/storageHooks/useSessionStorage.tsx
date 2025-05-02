import { useState } from 'react';

export const useSessionStorage = <T,>(key: string, initialValue: T) => {
  const [storageValue, setStorageValue] = useState<T>(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStorageValue(value);
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  };

  return [storageValue, setValue] as const;
};
