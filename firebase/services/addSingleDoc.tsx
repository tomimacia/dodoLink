import { addDoc, collection } from 'firebase/firestore';
import { firestore } from '../clientApp';

export const addSingleDoc = async (selectedCollection: string, param: any) => {
  const docRef = await addDoc(collection(firestore, selectedCollection), param);

  return docRef;
};
