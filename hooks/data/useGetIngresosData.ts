import { getSingleDoc } from '@/firebase/services/getSingleDoc';
import { obtenerFechasEntreTimestamps } from '@/helpers/cobros/obtenerFechasEntreTimestamps';
import { useEffect, useState } from 'react';
import { useSessionStorage } from '../storageHooks/useSessionStorage';
import { endOfMonth, getUnixTime, startOfMonth } from 'date-fns';

const useGetIngresosData = (month: number) => {
  const [ingresosData, setIngresosData] = useSessionStorage<any | null>(
    'INGRESOS_DATA_SESSION_STORAGE',
    null
  );
  const [loadingIngresos, setLoadingIngresos] = useState(false);
  const getIngresosData = async () => {
    setLoadingIngresos(true);

    try {
      // Timestamp seconds for 17-02-2025 (launch session admi)
      const now = new Date();
      const selectedDate = new Date(now.getFullYear(), month, 1); // `month` es 1-indexed, Date usa 0-indexed
      const startOfMonthTimestamp = getUnixTime(startOfMonth(selectedDate));
      const endOfMonthTimestamp = getUnixTime(endOfMonth(selectedDate));
      const daysToFetch = obtenerFechasEntreTimestamps(
        startOfMonthTimestamp,
        endOfMonthTimestamp
      );
      const promises = daysToFetch.map((d) => getSingleDoc('ingresos', d));
      const dayIngresosFetched = (await Promise.all(promises)).filter(
        (t) => t
      ) as any[];
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
      setIngresosData(dayIngresosFetched);
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingIngresos(false);
    }
  };
  useEffect(() => {
    try {
      getIngresosData();
    } catch (err) {
      console.log('Error getting productos', err);
    }
  }, [month]);
  return { ingresosData, loadingIngresos, getIngresosData, setIngresosData };
};

export default useGetIngresosData;
