import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../clientApp";

export const updateSingleDoc = async (
  selectedCollection: string,
  id: string,
  param: any
) => {
  await updateDoc(doc(firestore, selectedCollection, id), param);
};
