import axios from 'axios';
import { getSession } from 'next-auth/react';

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

const apiInstance = axios.create({
  baseURL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiInstance.interceptors.request.use(async (config) => {
  const session = await getSession();

  if (session?.jwtToken) {
    config.headers['Authorization'] = `Bearer ${session.jwtToken}`;
  }

  return config;
});

export default apiInstance;
