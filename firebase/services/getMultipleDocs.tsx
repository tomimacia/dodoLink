import {
  query,
  where,
  getDocs,
  collection as firebaseCollection,
  WhereFilterOp,
} from 'firebase/firestore';
import { firestore } from '../clientApp';

export const getMultipleDocs = async (
  collection: string,
  field: string,
  condition: WhereFilterOp,
  value: any
) => {
  try {
    // Create a query to get documents where "productos" array contains the specified ID
    const q = query(
      firebaseCollection(firestore, collection),
      where(field, condition, value)
    );

    // Execute the query and get the documents
    const querySnapshot = await getDocs(q);

    // Extract data from query snapshot
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return documents;
  } catch (error) {
    console.error('Error getting documents by product ID:', error);
    return [];
  }
};
