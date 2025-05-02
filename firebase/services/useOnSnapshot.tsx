import { firestore } from '@/firebase/clientApp'; // Asegúrate de que la ruta sea correcta
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const useOnSnapshot = (selectedCollection: string, docID: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const docRef = doc(firestore, selectedCollection, docID);
  useEffect(() => {
    const unsubscribe = onSnapshot(docRef, (snap) => {
      const snapData = snap.data();
      setData(snapData);
      setLoading(false);
    });
    //remember to unsubscribe from your realtime listener on unmount or you will create a memory leak
    return () => unsubscribe();
  }, []);
  return { data, loading };
};

export default useOnSnapshot;
