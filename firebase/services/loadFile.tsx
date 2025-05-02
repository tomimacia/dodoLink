import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { storage } from '../clientApp';
const loadFile = async (
  file: File | null,
  section: string,
  title: string
): Promise<object | null> => {
  if (!file) return null;
  const filePath = `${section}/${title}`;
  const storageRef = ref(storage, filePath);
  try {
    const uploadTask = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(uploadTask.ref);
    return { downloadURL, filePath };
  } catch (error: any) {
    alert(error.message);
    return null; // Return null in case of an error
  }
};

export default loadFile;
