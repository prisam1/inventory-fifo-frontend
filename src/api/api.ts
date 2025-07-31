import axios from 'axios';

//const API_BASE_URL = 'http://localhost:10000/api';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
 
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
 
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
     
      console.error('Authentication error: Token expired or invalid.');
      localStorage.removeItem('token');
      
    }
    return Promise.reject(error);
  }
);

export default api;