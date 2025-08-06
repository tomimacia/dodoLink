import { useEffect, useState } from 'react';
import { useSessionStorage } from '../storageHooks/useSessionStorage';

const useGetOrders = () => {
  const [orders, setOrders] = useSessionStorage<any[] | null>(
    'ORDERS_SESSION_STORAGE_DODO',
    null
  );
  const [loadingOrders, setLoadingOrders] = useState(false);
  const getOrders = async () => {
    console.log('Getting orders');
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/sqlDB/orders');
      const data = await res.json();
      setOrders(data as any[]);
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingOrders(false);
    }
  };
  useEffect(() => {
    if (orders !== null) return;

    try {
      getOrders();
    } catch (err) {
      console.log('Error getting orders', err);
    }
  }, [orders, setOrders, getOrders]);
  return {
    loadingOrders,
    setOrders,
    getOrders,
    orders,
  };
};

export default useGetOrders;
