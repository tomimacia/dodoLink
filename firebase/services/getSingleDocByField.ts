import {
  query,
  where,
  getDocs,
  collection as firebaseCollection,
  WhereFilterOp,
} from 'firebase/firestore';
import { firestore } from '../clientApp';

export const getSingleDocByField = async (
  collection: string,
  field: string,
  condition: WhereFilterOp,
  value: any
) => {
  try {
    const q = query(
      firebaseCollection(firestore, collection),
      where(field, condition, value)
    );

    const querySnapshot = await getDocs(q);
    const docSnapshot = querySnapshot.docs[0];

    if (!docSnapshot) return undefined;

    return {
      id: docSnapshot.id,
      ...docSnapshot.data(),
    };
  } catch (error) {
    console.error('Error getting document:', error);
    return undefined;
  }
};
