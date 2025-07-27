import { getCollection } from '@/firebase/services/getCollection';

import { useEffect, useState } from 'react';
type NodoType = any;

const useGetNodos = () => {
  const [nodos, setNodos] = useState<NodoType[] | null>(null);

  const [loadingNodos, setLoadingNodos] = useState(false);
  const getNodos = async () => {
    console.log('Getting nodos');
    setLoadingNodos(true);
    try {
      const newNodos = (await getCollection('nodos')) as NodoType[];

      setNodos(newNodos);
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingNodos(false);
    }
  };
  const deleteNodo = (nodoID: string) => {
    const newNodos = nodos?.filter((c) => c.id !== nodoID);
    setNodos(newNodos || []);
  };
  const addNodo = (newNodo: NodoType) => {
    setNodos([...(nodos || []), newNodo]);
  };
  useEffect(() => {
    if (nodos !== null) return;
    try {
      getNodos();
    } catch (err) {
      console.log('Error getting nodos', err);
    }
  }, []);

  return {
    loadingNodos,
    setNodos,
    getNodos,
    nodos,
    deleteNodo,
    addNodo,
  };
};

export default useGetNodos;
