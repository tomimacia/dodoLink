import { useEffect, useState } from 'react';
import { useSessionStorage } from '../storageHooks/useSessionStorage';

const useGetServiciosSQL = () => {
  const [serviciosSQL, setServiciosSQL] = useSessionStorage<any[] | null>(
    'SERVICIOS_SESSION_STORAGE',
    null
  );
  const [loadingServicios, setLoadingServicios] = useState(false);
  const getServicios = async () => {
    setLoadingServicios(true);
    try {
      const res = await fetch('/api/sqlDB/products');
      const data = await res.json();
      setServiciosSQL(data as any[]);
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingServicios(false);
    }
  };
  useEffect(() => {
    if (serviciosSQL !== null) return;

    try {
      getServicios();
    } catch (err) {
      console.log('Error getting servicios', err);
    }
  }, [serviciosSQL, setServiciosSQL, getServicios]);
  return {
    loadingServicios,
    setServiciosSQL,
    getServicios,
    serviciosSQL,
  };
};

export default useGetServiciosSQL;
