import { ref, deleteObject, listAll } from 'firebase/storage';
import { storage } from '../clientApp';

export const deleteFile = async (filePath: string): Promise<void> => {
  const fileRef = ref(storage, filePath);

  try {
    await deleteObject(fileRef);
    console.log(`File ${filePath} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error);
    throw error;
  }
};

export const deleteMultipleFiles = async (filePaths: string[]) => {
  // Create an array of promises to delete files
  const deletePromises = filePaths.map((filePath) => deleteFile(filePath));

  try {
    // Use Promise.all to delete all files in parallel
    await Promise.all(deletePromises);
    console.log('All files deleted successfully.');
  } catch (error) {
    console.error('Error deleting files:', error);
    throw error;
  }
};
export const deleteDirectory = async (directoryPath: string): Promise<void> => {
  const directoryRef = ref(storage, directoryPath);

  try {
    const listResult = await listAll(directoryRef);

    // Eliminar todos los archivos en el directorio
    const deletePromises = listResult.items.map((itemRef) =>
      deleteObject(itemRef)
    );

    // Eliminar subdirectorios recursivamente
    const subdirectoryPromises = listResult.prefixes.map((subDirRef) =>
      deleteDirectory(subDirRef.fullPath)
    );

    await Promise.all([...deletePromises, ...subdirectoryPromises]);

    console.log(`Directory ${directoryPath} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting directory ${directoryPath}:`, error);
    throw error;
  }
};
