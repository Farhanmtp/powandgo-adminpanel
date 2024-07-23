import { AxiosError } from 'axios';
import apiInstance from '.';
import axios from 'axios';

interface UserData {
  id: number;
  email: string;
  password?: string;
  use?: string;
  confirmationToken?: string | null;
  isConfirmed?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface LoginResponse {
  message: string;
  data: UserData;
}

export async function login(email: string, password: string): Promise<any> {
  try {
    const response = await apiInstance.post<any>('users/login', {
      email,
      password,
    });

    return response?.data;
  } catch (error) {
    throw error;
  }
}

export async function verifyEmail(token: string): Promise<any> {
  try {
    const response = await apiInstance.get(`/users/${token}`);
    if (response.status === 200) {
      return response.data;
    } else throw new Error('Email verification unsuccessful');
  } catch (error) {
    if (axios.isAxiosError(error) && error?.response?.status === 300) {
      throw new Error('Email verification unsuccessful');
    }
    throw error;
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}users/reset-password`,
      {
        password: newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      return response.data;
    } else throw new Error('Password Reset unsuccessful');
  } catch (error) {
    throw error;
  }
}

export async function getUser(userId: number) {
  try {
    const response = await apiInstance.get(`users/${userId}/profile`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
