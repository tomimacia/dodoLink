import { deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../clientApp";

export const deleteSingleDoc = async (
  selectedCollection: string,
  id: string
) => {
  await deleteDoc(doc(firestore, selectedCollection, id));
};
