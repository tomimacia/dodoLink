import { deleteSingleDoc } from '@/firebase/services/deleteSingleDoc';
import { getMultipleDocs } from '@/firebase/services/getMultipleDocs';
import { setSingleDoc } from '@/firebase/services/setSingleDoc';
import { addMonths, isAfter } from 'date-fns';
import { useEffect, useState } from 'react';
import { useSessionStorage } from './storageHooks/useSessionStorage';

const useGetClientes = () => {
  const [clientes, setClientes] = useSessionStorage<any[]>(
    `CLIENTES_SESSION_STORAGE`,
    []
  );
  const [clientesInactivos, setClientesInactivos] = useSessionStorage<any[]>(
    `CLIENTES_INACTIVOS_SESSION_STORAGE`,
    []
  );
  const [loadingClientes, setLoadingClientes] = useState(false);
  const getClientes = async () => {
    setLoadingClientes(true);
    try {
      const clientesFetched = (await getMultipleDocs(
        'clientes',
        'activo',
        '==',
        true
      )) as any[];
      const clientesFetchedInactivos = (await getMultipleDocs(
        'clientes',
        'activo',
        '==',
        false
      )) as any[];
      // Condition: actual date - vencimiento date > 30 days

      const clientesInactivosNew = clientesFetched.filter((c) => {
        const target = addMonths(c.vencimiento.seconds * 1000, 1);
        const ahora = new Date();

        return isAfter(ahora, target);
      });
      const clientesActivos = clientesFetched.filter((c) => {
        const target = addMonths(c.vencimiento.seconds * 1000, 1);
        const ahora = new Date();

        return isAfter(target, ahora);
      });
      const promises = clientesInactivosNew.map((c) => {
        return setSingleDoc('clientes', c.id, { activo: false });
      });
      await Promise.all(promises);

      setClientes(clientesActivos);
      setClientesInactivos([
        ...clientesFetchedInactivos,
        ...clientesInactivosNew,
      ]);
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingClientes(false);
    }
  };
  useEffect(() => {
    if (clientes.length > 0) return;
    getClientes();
  }, []);
  const deleteCliente = async (id: string) => {
    await deleteSingleDoc('clientes', id);
    const newClientes = clientes.filter((c) => c.id !== id);
    setClientes(newClientes);
  };
  return {
    loadingClientes,
    clientesInactivos,
    setClientes,
    getClientes,
    clientes,
    deleteCliente,
  };
};

export default useGetClientes;
