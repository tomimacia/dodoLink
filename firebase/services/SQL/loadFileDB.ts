import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const loadFileDB = async (data: { file: File; id: string }) => {
  if (!data) throw new Error('Archivo requerido');
  if (typeof data.file !== 'object' || !data.id) throw new Error('Error');
  const formData = new FormData();
  formData.append('file', data.file);
  formData.append('id', data.id);
  try {
    const res = await axios.post(`${API_URL}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }); // Devuelve el id y la URL que retorna el backend
    return res.data;
  } catch (error: any) {
    console.error('Error al subir archivo:', error);
    throw error;
  }
};

export default loadFileDB;
