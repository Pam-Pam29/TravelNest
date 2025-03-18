import axios from 'axios';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Booking } from '../types/Booking';
import { authService } from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const bookingService = {
  async createBooking(bookingData: {
    packageId: string;
    travelDate: Date;
    numberOfTravelers: number;
  }) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const token = authService.getToken();
    const response = await axios.post(`${API_URL}/bookings, bookingData`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  
  async getUserBookings() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const token = authService.getToken();
    const response = await axios.get(`${API_URL}api/bookings`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  
  async cancelBooking(bookingId: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const token = authService.getToken();
    const response = await axios.patch(
      `${API_URL}/bookings/${bookingId}/cancel`, 
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  }
}; 