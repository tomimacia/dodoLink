import { getSingleDoc } from '@/firebase/services/getSingleDoc';
import { MovimientosType } from '@/types/types';
import { useEffect, useState } from 'react';

const useGetDayData = (day: string) => {
  const [movimientos, setMovimientos] = useState<MovimientosType | null>(null);
  const [ingresos, setIngresos] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(false);
  const getData = async () => {
    setLoadingData(true);
    try {
      const movimientosFetched = (await getSingleDoc(
        'movimientos',
        day
      )) as MovimientosType;
      const ingresosFetched = (await getSingleDoc('ingresos', day)) as any;
      setMovimientos(movimientosFetched);
      setIngresos(ingresosFetched);
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingData(false);
    }
  };
  useEffect(() => {
    try {
      getData();
    } catch (err) {
      console.log('Error getting movimientos', err);
    }
  }, [day]);
  const totalIngresos = ingresos
    ? Object.values(ingresos)
        .flat()
        .filter((ing: any) => typeof ing === 'object')
    : [];
  const totalNoRepetidos = totalIngresos.filter(
    (ing: any, index, arr) =>
      arr.findIndex((item: any) => item?.DNI === ing?.DNI) === index
  );
  return {
    loadingData,
    setMovimientos,
    getData,
    movimientos,
    ingresos,
    totalIngresos,
    totalNoRepetidos,
  };
};

export default useGetDayData;
