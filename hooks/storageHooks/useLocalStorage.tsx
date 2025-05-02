import { useState } from 'react';

export const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storageValue, setStorageValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStorageValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  };

  return [storageValue, setValue] as const;
};
