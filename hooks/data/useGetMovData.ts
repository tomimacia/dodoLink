import { getSingleDoc } from '@/firebase/services/getSingleDoc';
import { obtenerFechasEntreTimestamps } from '@/helpers/cobros/obtenerFechasEntreTimestamps';
import { MovimientosType } from '@/types/types';
import { useEffect, useState } from 'react';
import { useSessionStorage } from '../storageHooks/useSessionStorage';
import { endOfMonth, getUnixTime, startOfMonth } from 'date-fns';

const useGetMovimientosData = (month: number) => {
  const [movimientosData, setMovimientosData] = useSessionStorage<any | null>(
    'MOVIMIENTOS_DATA_SESSION_STORAGE',
    null
  );
  const [loadingMovimientos, setLoadingMovimientos] = useState(false);
  const getMovimientosData = async () => {
    setLoadingMovimientos(true);
    try {
      // Timestamp seconds for 17-02-2025 (launch session admi)

      // Obtener el timestamp del inicio y final del mes seleccionado
      const now = new Date();
      const selectedDate = new Date(now.getFullYear(), month, 1); // `month` es 1-indexed, Date usa 0-indexed
      const startOfMonthTimestamp = getUnixTime(startOfMonth(selectedDate));
      const endOfMonthTimestamp = getUnixTime(endOfMonth(selectedDate));
      // Obtener días a traer dentro del rango
      const daysToFetch = obtenerFechasEntreTimestamps(
        startOfMonthTimestamp,
        endOfMonthTimestamp
      );
      const promises = daysToFetch.map((d) => getSingleDoc('movimientos', d));

      const movimientosFetched = (await Promise.all(promises)).filter(
        (t) => t
      ) as MovimientosType[];
      // const reduced = movimientosFetched.reduce((acc: any, it, ind) => {
      //   const day = daysToFetch[ind];
      //   acc[day] = it;
      //   return acc;
      // }, {});
      setMovimientosData(movimientosFetched);
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingMovimientos(false);
    }
  };
  useEffect(() => {
    try {
      getMovimientosData();
    } catch (err) {
      console.log('Error getting productos', err);
    }
  }, [month]);
  return {
    movimientosData,
    loadingMovimientos,
    getMovimientosData,
    setMovimientosData,
  };
};

export default useGetMovimientosData;
