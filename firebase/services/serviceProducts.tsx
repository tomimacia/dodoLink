import {
  collection,
  getDocs,
  query,
  QueryConstraint,
} from "firebase/firestore";
import { firestore } from "../clientApp";

export const getProducts = async (
  thisCollection: string,
  queryArr: QueryConstraint[]
) => {
  const productsCollectionRef = collection(firestore, thisCollection);
  const prevData = await getDocs(query(productsCollectionRef, ...queryArr));
  const data = prevData.docs.map((product) => ({
    ...product.data(),
    id: product.id,
  }));
  return data;
};
