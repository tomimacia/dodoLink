import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const deleteFileDB = async (id: string) => {
  if (!id) throw new Error('Archivo requerido');

  try {
    const res = await axios.delete(`${API_URL}/files/${id}`);
    return res.data; // { ok: true }
  } catch (error: any) {
    console.error('Error al eliminar archivo:', error);
    throw error;
  }
};

export default deleteFileDB;
