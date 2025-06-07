import { useEffect, useState } from 'react';
import { useSessionStorage } from '../storageHooks/useSessionStorage';

const useGetServicios = () => {
  const [servicios, setServicios] = useSessionStorage<any[] | null>(
    'SERVICIOS_SESSION_STORAGE',
    null
  );
  const [loadingServicios, setLoadingServicios] = useState(false);
  const getServicios = async () => {
    setLoadingServicios(true);
    try {
      const res = await fetch('/api/sqlDB/products');
      const data = await res.json();
      setServicios(data as any[]);
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingServicios(false);
    }
  };
  useEffect(() => {
    if (servicios !== null) return;

    try {
      getServicios();
    } catch (err) {
      console.log('Error getting servicios', err);
    }
  }, [servicios, setServicios, getServicios]);
  return {
    loadingServicios,
    setServicios,
    getServicios,
    servicios,
  };
};

export default useGetServicios;
