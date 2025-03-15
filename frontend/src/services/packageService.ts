import axios from 'axios';
import { Package } from '../types/Package';
import { authService } from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const packageService = {
  async getAllPackages(filters?: {
    minPrice?: number;
    maxPrice?: number;
    destination?: string;
    duration?: number;
  }) {
    const response = await axios.get('${API_URL}/packages, { params: filters }');
    return response.data;
  },

  async getPackageById(id: string) {
    const response = await axios.get('${API_URL}/packages/${id}');
    return response.data;
  },

  async createPackage(packageData: Partial<Package>) {
    const token = authService.getToken();
    const response = await axios.post('${API_URL}/packages, packageData', {
      headers: { Authorization: 'Bearer ${token}' }
    });
    return response.data;
  }
};

