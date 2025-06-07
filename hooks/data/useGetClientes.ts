import { useEffect, useState } from 'react';
import { useSessionStorage } from '../storageHooks/useSessionStorage';

const useGetClientes = () => {
  const [clientes, setClientes] = useSessionStorage<any[] | null>(
    'CLIENTES_SESSION_STORAGE',
    null
  );
  const [loadingClientes, setLoadingClientes] = useState(false);
  const getClientes = async () => {
    console.log('Getting clientes');
    setLoadingClientes(true);
    try {
      const res = await fetch('/api/sqlDB/users');
      const data = await res.json();
      setClientes(data as any[]);
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingClientes(false);
    }
  };
  useEffect(() => {
    if (clientes !== null) return;

    try {
      getClientes();
    } catch (err) {
      console.log('Error getting clientes', err);
    }
  }, [clientes, setClientes, getClientes]);
  return {
    loadingClientes,
    setClientes,
    getClientes,
    clientes,
  };
};

export default useGetClientes;
