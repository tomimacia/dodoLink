import { getSingleDoc } from '@/firebase/services/getSingleDoc';
import { obtenerFechasEntreTimestamps } from '@/helpers/cobros/obtenerFechasEntreTimestamps';
import { MovimientosType, PedidoType } from '@/types/types';
import {
  addMonths,
  endOfMonth,
  getUnixTime,
  startOfMonth,
  subMonths,
} from 'date-fns';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useSessionStorage } from '../storageHooks/useSessionStorage';
import { useToast } from '@chakra-ui/react';

const useGetMovMonthData = (month: number, year: number) => {
  const [monthData, setMonthData] = useSessionStorage<any | null>(
    `INGRESOS_DATA_SESSION_STORAGE_${month}_${year}_DODO`,
    null
  );
  const [loadingMonthData, setLoadingMonthData] = useState(false);
  const toast = useToast();
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
  const monthReservas: PedidoType[] = getSectionData('reservas');
  const monthCompras: PedidoType[] = getSectionData('compras');

  const minusMonth = (date: Date, setDate: Dispatch<SetStateAction<Date>>) => {
    if (month <= 4)
      return toast({
        title: 'No puedes retroceder',
        description: 'El mes seleccionado es el primero.',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    setDate(subMonths(date, 1));
  };
  const plusMonth = (date: Date, setDate: Dispatch<SetStateAction<Date>>) => {
    if (
      month >= new Date().getMonth() &&
      new Date().getFullYear() === date.getFullYear()
    )
      return toast({
        title: 'No puedes avanzar',
        description: 'El mes seleccionado es el actual.',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    setDate(addMonths(date, 1));
  };
  const monthHandler = {
    minusMonth,
    plusMonth,
  };
  return {
    monthData,
    monthReservas,
    monthCompras,
    loadingMonthData,
    getMonthData,
    setMonthData,
    monthHandler,
  };
};

export default useGetMovMonthData;
