import { getCollection } from '@/firebase/services/getCollection';
import useOnSnapshot from '@/firebase/services/useOnSnapshot';

import { Timestamp } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { useLocalStorage } from '../storageHooks/useLocalStorage';

type NodoType = any;

const NodoKEY = 'NODOS_SESSION_STORAGE';
const lastUpdateNodosKEY = 'NODOS_LASTUPDATE_SECONDS_SESSION_STORAGE';

const useGetNodos = (shouldUpdate: boolean = false) => {
  const [nodos, setNodos] = useLocalStorage<NodoType[] | null>(NodoKEY, null);
  const [lastUpdateNodos, setLastUpdate] = useLocalStorage<number | null>(
    lastUpdateNodosKEY,
    null
  );
  const hasFetched = useRef(false);
  const [loadingNodos, setLoadingNodos] = useState(false);
  const getNodos = async () => {
    console.log('updating Nodos');
    setLoadingNodos(true);
    try {
      const NodosFetched = await getCollection('nodos');
      const withoutMetadata = NodosFetched.filter((p) => p.id !== 'metadata');
      const now = Timestamp.now();
      setLastUpdate(now.seconds);
      setNodos(withoutMetadata as NodoType[]);
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingNodos(false);
    }
  };
  const updateNodo = async (NodoID: string, newNodo: NodoType) => {
    if (!nodos) return;
    const newNodos = nodos?.map((p) => (p.id === NodoID ? newNodo : p));
    setNodos(newNodos);
    try {
      //   await updateProductosLastStamp();
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    if (nodos === null) {
      getNodos();
    }
    // else {
    //   checkForUpdates();
    // }
  }, [nodos, lastUpdateNodos]);
  const { data: metadata, loading } = useOnSnapshot('nodos', 'metadata');
  const checkUpdates = async () => {
    setTimeout(async () => {
      const lastUpdateUpdated = window.localStorage.getItem(lastUpdateNodosKEY);
      if (metadata.lastUpdate.seconds !== Number(lastUpdateUpdated)) {
        await getNodos();
        setLastUpdate(metadata.lastUpdate.seconds);
      } else {
        const newNodos = window.localStorage.getItem(NodoKEY);
        if (newNodos) {
          const parsed = JSON.parse(newNodos);
          setNodos(parsed);
        }
        console.log('Nodos up to date');
      }
    }, 50);
  };
  useEffect(() => {
    if (!loading && metadata?.lastUpdate && shouldUpdate) {
      checkUpdates();
    }
  }, [metadata]);
  return {
    loadingNodos,
    setNodos,
    getNodos,
    checkUpdates,
    nodos,
    updateNodo,
  };
};

export default useGetNodos;
