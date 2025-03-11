import axios from 'axios';
import { User } from '../types/User';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  firstName?: string;
  lastName?: string;
}

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await axios.post(${API_URL}/auth/login, credentials);
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
    }
    return response.data.user;
  },

  async register(credentials: RegisterCredentials) {
    const response = await axios.post(${API_URL}/auth/register, credentials);
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
    }
    return response.data.user;
  },

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  }
};

