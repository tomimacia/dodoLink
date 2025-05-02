import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '../clientApp';

export const setSingleDoc = async (
  selectedCollection: string,
  customID: string,
  param: any
) => {
  await setDoc(doc(firestore, selectedCollection, customID), param, {
    merge: true,
  });
};
