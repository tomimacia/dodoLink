import { useUser } from '@/context/userContext';
import { getSingleDoc } from '@/firebase/services/getSingleDoc';
import { setSingleDoc } from '@/firebase/services/setSingleDoc';
import { obtenerFechasEntreTimestamps } from '@/helpers/cobros/obtenerFechasEntreTimestamps';
import {
  CajaType,
  IngresoType,
  TotalCajaType,
  MontoInicialCajaType,
  MovimientosType,
} from '@/types/types';
import { arrayUnion, Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const useGetMovimientos = (day: string) => {
  const { user } = useUser();
  const [movimientos, setMovimientos] = useState<MovimientosType | null>(null);
  const [loadingMovimientos, setLoadingMovimientos] = useState(false);
  const [loadingCaja, setLoadingCaja] = useState(false);
  const closedCaja = {
    isOpen: false,
    apertura: {
      seconds: 9999999999999999999999,
      nanoseconds: 9999999999999999999999,
    },
    montoInicial: {
      Mercadopago: 0,
      Efectivo: 0,
    },
    id: 'caja',
  };
  const [caja, setCaja] = useState<CajaType | null>(closedCaja);
  const updateCaja = async () => {
    const newCaja = (await getSingleDoc('movimientos', 'caja')) as CajaType;
    setCaja(newCaja);
    return newCaja;
  };
  const getMovimientos = async (selectedCaja?: CajaType) => {
    setLoadingMovimientos(true);
    let finalCaja = selectedCaja;

    try {
      if (!selectedCaja) {
        const newCaja = (await updateCaja()) as CajaType;
        finalCaja = newCaja;
      }
      if (!finalCaja?.isOpen) {
        setCaja(closedCaja);
        console.log('Caja Cerrada');
        return;
      }
      const daysToFetch = obtenerFechasEntreTimestamps(
        finalCaja?.apertura.seconds || 0
      );
      const promises = daysToFetch.map((d) => getSingleDoc('movimientos', d));

      const movimientosFetched = (await Promise.all(promises)).filter(
        (t) => t
      ) as MovimientosType[];
      const arranged = movimientosFetched.reduce(
        (acc: any, it: any) => {
          acc = {
            ingresos: [...acc.ingresos, ...it?.ingresos],
            egresos: [...acc.egresos, ...it?.egresos],
          };
          return acc;
        },
        {
          ingresos: [],
          egresos: [],
        }
      );
      const filtered = {
        ingresos: arranged.ingresos.filter(
          (i: IngresoType) =>
            i.fecha.seconds > (finalCaja as CajaType)?.apertura?.seconds
        ),
        egresos: arranged.egresos.filter(
          (i: IngresoType) =>
            i.fecha.seconds > (finalCaja as CajaType)?.apertura?.seconds
        ),
        fecha: daysToFetch[daysToFetch.length - 1],
      };
      setMovimientos(filtered as any);
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingMovimientos(false);
    }
  };
  useEffect(() => {
    try {
      getMovimientos();
    } catch (err) {
      console.log('Error getting movimientos', err);
    }
  }, [day]);
  const abrirCaja = async (monto: MontoInicialCajaType) => {
    if (!monto) return;
    setLoadingCaja(true);
    try {
      const newCaja = {
        isOpen: true,
        apertura: Timestamp.now(),
        montoInicial: monto,
        id: 'caja',
      };
      await setSingleDoc('movimientos', 'caja', newCaja);
      await getMovimientos(newCaja);
      setCaja(newCaja);
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingCaja(false);
    }
  };
  const cerrarCaja = async (montoFinal: TotalCajaType) => {
    setLoadingCaja(true);
    try {
      await setSingleDoc('movimientos', 'metadata', {
        cierresDeCaja: arrayUnion({
          apertura: caja?.apertura,
          cierre: Timestamp.now(),
          montoInicial: caja?.montoInicial,
          montoFinal,
          creadorID: user?.id,
        }),
      });
      await setSingleDoc('movimientos', 'caja', closedCaja);
      setCaja(closedCaja);
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingCaja(false);
    }
  };
  return {
    loadingMovimientos,
    setMovimientos,
    getMovimientos: () => getMovimientos(),
    movimientos,
    caja,
    abrirCaja,
    cerrarCaja,
    loadingCaja,
  };
};

export default useGetMovimientos;
