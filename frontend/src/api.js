import axios from 'axios';
import { auth } from './firebase';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
    config.headers['x-auth-uid'] = user.uid; // for our dev backend middleware
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
