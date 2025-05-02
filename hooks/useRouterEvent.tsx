import { useEffect, useState } from 'react';
import Router from 'next/router';

export const useRouterEvent = () => {
  const [loading, setLoading] = useState<boolean>(false); // Added type annotation

  useEffect(() => {
    let startTimeout: NodeJS.Timeout | null = null; // Added type annotation

    const start = () => {
      startTimeout = setTimeout(() => {
        setLoading(true);
      }, 1000);
    };

    const end = () => {
      setLoading(false);
      if (startTimeout !== null) {
        clearTimeout(startTimeout);
      }
    };

    Router.events.on('routeChangeStart', start);
    Router.events.on('routeChangeComplete', end);
    Router.events.on('routeChangeError', end);

    return () => {
      Router.events.off('routeChangeStart', start);
      Router.events.off('routeChangeComplete', end);
      Router.events.off('routeChangeError', end);
    };
  }, []);

  return { loading };
};
