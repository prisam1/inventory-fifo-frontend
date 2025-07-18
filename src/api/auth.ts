import api from './api';
import { User } from '../types';

interface LoginResponse {
  token: string;
  user: User;  
}

export const login = async (credentials: any): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};