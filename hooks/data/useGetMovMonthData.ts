import { getSingleDoc } from '@/firebase/services/getSingleDoc';
import { obtenerFechasEntreTimestamps } from '@/helpers/cobros/obtenerFechasEntreTimestamps';
import { MovimientosType } from '@/types/types';
import { endOfMonth, getUnixTime, startOfMonth } from 'date-fns';
import { useEffect, useState } from 'react';
import { useSessionStorage } from '../storageHooks/useSessionStorage';

const useGetMovMonthData = (month: number, year: number) => {
  const [monthData, setMonthData] = useSessionStorage<any | null>(
    `INGRESOS_DATA_SESSION_STORAGE_${month}_${year}`,
    null
  );
  const [loadingMonthData, setLoadingMonthData] = useState(false);
  const getMonthData = async () => {
    setLoadingMonthData(true);

    try {
      // Timestamp seconds for 17-02-2025 (launch session admi)
      const selectedDate = new Date(year, month, 1); // `month` es 1-indexed, Date usa 0-indexed
      const startOfMonthTimestamp = getUnixTime(startOfMonth(selectedDate));
      const endOfMonthTimestamp = getUnixTime(endOfMonth(selectedDate));
      const daysToFetch = obtenerFechasEntreTimestamps(
        startOfMonthTimestamp,
        endOfMonthTimestamp
      );
      const promises = daysToFetch.map((d) => getSingleDoc('movimientos', d));
      const dayIngresosFetched = (await Promise.all(promises)).filter(
        (t) => t
      ) as MovimientosType[];
      // let promisesUpdate = [];
      // const reduced = dayIngresosFetched.reduce((acc: any, it, ind) => {
      //   const todaySlahDate = dateTexto(new Date().getTime() / 1000).slashDate;
      //   const isToday = todaySlahDate === it?.id;

      //   let data = it?.metadata;
      //   if (!data) {
      //     console.log(it);
      //     const newData = {
      //       Total: {
      //         Habilitado: 0,
      //         Vencido: 0,
      //         Inhabilitado: 0,
      //       },
      //       PorHora: {
      //         '7': { Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
      //         '8': { Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
      //         '9': { Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
      //         '10': { Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
      //         '11': { Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
      //         '12': { Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
      //         '13': { Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
      //         '14': { Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
      //         '15': { Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
      //         '16': { Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
      //         '17': { Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
      //         '18': { Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
      //         '19': { Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
      //         '20': { Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
      //         '21': { Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
      //         '22': { Habilitado: 0, Vencido: 0, Inhabilitado: 0 },
      //       },
      //     };
      //     data = newData;
      //     if (!isToday) {
      //       // console.log('updating data');
      //     }
      //   }
      //   acc[it.id] = it;
      //   return acc;
      // }, {});
      setMonthData(dayIngresosFetched);
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingMonthData(false);
    }
  };
  useEffect(() => {
    try {
      getMonthData();
    } catch (err) {
      console.log('Error getting productos', err);
    }
  }, [month]);
  const getSectionData = (field: 'reservas' | 'compras') => {
    if (!monthData) return [];
    const final = monthData.map((d: MovimientosType) => d[field]);
    return final.flat();
  };
  const monthReservas = getSectionData('reservas');
  const monthCompras = getSectionData('compras');
  return {
    monthData,
    monthReservas,
    monthCompras,
    loadingMonthData,
    getMonthData,
    setMonthData,
  };
};

export default useGetMovMonthData;
