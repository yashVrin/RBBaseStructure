import axios, { AxiosInstance } from 'axios';
import Config from 'react-native-config';

// Prefer env, but provide a safe fallback to avoid "Network Error" when undefined
const baseURL = (Config.API_BASE_URL || '').trim() || 'https://jsonplaceholder.typicode.com';

const axiosClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosClient;
