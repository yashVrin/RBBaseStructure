import axios, { AxiosInstance } from 'axios';
import Config from 'react-native-config';

const axiosClient: AxiosInstance = axios.create({
  baseURL: Config.API_BASE_URL,
  // baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosClient;
