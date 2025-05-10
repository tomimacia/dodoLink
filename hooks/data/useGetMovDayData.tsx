import { getSingleDoc } from '@/firebase/services/getSingleDoc';
import { MovimientosType } from '@/types/types';
import { useEffect, useState } from 'react';

const useGetMovDayData = (day: string) => {
  const [movimientos, setMovimientos] = useState<MovimientosType | null>();
  const [loadingData, setLoadingData] = useState(false);
  const getData = async () => {
    setLoadingData(true);
    try {
      const movimientosFetched = (await getSingleDoc(
        'movimientos',
        day
      )) as MovimientosType;
      setMovimientos(movimientosFetched);
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
  const { reservas, compras } = movimientos ?? {};
  return {
    loadingData,
    setMovimientos,
    getData,
    reservas,
    compras,
  };
};

export default useGetMovDayData;
