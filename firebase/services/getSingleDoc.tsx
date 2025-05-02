import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../clientApp';

export const getSingleDoc = async (collection: string, param: string) => {
  if (!param) return;
  const element = await getDoc(doc(firestore, collection, param));
  return element.data()
    ? {
        ...element.data(),
        id: element.id,
      }
    : undefined;
};
