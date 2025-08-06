import { useEffect, useState } from 'react';
import { useSessionStorage } from '../storageHooks/useSessionStorage';

const useGetHosting = () => {
  const [hosting, setHosting] = useSessionStorage<any[] | null>(
    'HOSTING_SESSION_STORAGE_DODO',
    null
  );
  const [loadingHosting, setLoadingHosting] = useState(false);
  const getHosting = async () => {
    console.log('Getting hosting');
    setLoadingHosting(true);
    try {
      const res = await fetch('/api/sqlDB/hosting');
      const data = await res.json();
      setHosting(data as any[]);
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingHosting(false);
    }
  };
  useEffect(() => {
    if (hosting !== null) return;

    try {
      getHosting();
    } catch (err) {
      console.log('Error getting hosting', err);
    }
  }, [hosting, setHosting, getHosting]);
  return {
    loadingHosting,
    setHosting,
    getHosting,
    hosting,
  };
};

export default useGetHosting;
