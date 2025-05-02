import axios from 'axios';
const DELETE_USER_URL = 'https://deleteuser-qr6sw2jzlq-uc.a.run.app';
export const deleteUser = async (uid: string) => {
  try {
    const response = await axios.post(
      DELETE_USER_URL,
      {
        uid,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Usuario eliminado:', response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      '❌ Error al eliminar usuario:',
      error.response?.data || error.message
    );
    throw error;
  }
};
