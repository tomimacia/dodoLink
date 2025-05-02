import axios from 'axios';

interface CreateUserResponse {
  message: string;
  uid: string;
  token?: string; // opcional, si tu backend lo devuelve
}

interface CreateUserData {
  email: string;
  password: string;
  displayName: string;
}
const CREATE_USER_URL = 'https://createuser-qr6sw2jzlq-uc.a.run.app';
export async function createUserNoLogin(
  data: CreateUserData
): Promise<CreateUserResponse> {
  try {
    const response = await axios.post<CreateUserResponse>(
      CREATE_USER_URL,
      data
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data || 'Failed to create user');
  }
}
