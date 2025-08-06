import { getCollection } from '@/firebase/services/getCollection';
import useOnSnapshot from '@/firebase/services/useOnSnapshot';
import {
  lastUpdateServiciosKEY,
  updateServiciosLastStamp,
} from '@/helpers/updateStamps';
import { ServicioFirebaseType } from '@/types/types';
import { Timestamp } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { useLocalStorage } from '../storageHooks/useLocalStorage';

const serviciosKEY = 'SERVICIOS_DB_SESSION_STORAGE_DODO';
const useGetServicios = (shouldUpdate: boolean = false) => {
  const [servicios, setServicios] = useLocalStorage<
    ServicioFirebaseType[] | null
  >(serviciosKEY, null);
  const [lastUpdateServicios, setLastUpdate] = useLocalStorage<number | null>(
    lastUpdateServiciosKEY,
    null
  );
  const hasFetched = useRef(false);
  const [loadingServicios, setLoadingServicios] = useState(false);
  const getServicios = async () => {
    console.log('updating servicios');
    setLoadingServicios(true);
    try {
      const serviciosFetched = await getCollection('servicios');
      const withoutMetadata = serviciosFetched.filter(
        (p) => p.id !== 'metadata'
      );
      const now = Timestamp.now();
      setLastUpdate(now.seconds);
      setServicios(withoutMetadata as ServicioFirebaseType[]);
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingServicios(false);
    }
  };
  const updateServicio = async (
    serviceID: string,
    newService: ServicioFirebaseType
  ) => {
    if (!servicios) return;
    const newServicios = servicios?.map((p) =>
      p.id === serviceID ? newService : p
    );
    setServicios(newServicios);
    try {
      await updateServiciosLastStamp();
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (hasFetched.current) {
      return;
    }
    hasFetched.current = true;

    if (servicios === null) {
      getServicios();
    }
  }, [servicios, lastUpdateServicios]);
  const { data: metadata, loading } = useOnSnapshot('servicios', 'metadata');
  const checkUpdates = async () => {
    setTimeout(async () => {
      const lastUpdateUpdated = window.localStorage.getItem(
        lastUpdateServiciosKEY
      );
      if (metadata.lastUpdate.seconds !== Number(lastUpdateUpdated)) {
        await getServicios();
        setLastUpdate(metadata.lastUpdate.seconds);
      } else {
        const newServicios = window.localStorage.getItem(serviciosKEY);
        if (newServicios) {
          const parsed = JSON.parse(newServicios);
          setServicios(parsed);
        }
        console.log('Servicios up to date');
      }
    }, 50);
  };
  useEffect(() => {
    if (!loading && metadata?.lastUpdate && shouldUpdate) {
      checkUpdates();
    }
  }, [metadata, shouldUpdate]);
  return {
    loadingServicios,
    setServicios,
    getServicios,
    checkUpdates,
    servicios,
    updateServicio,
  };
};

export default useGetServicios;
