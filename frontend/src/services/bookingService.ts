import axios from 'axios';
import { Booking } from '../types/Booking';
import { authService } from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const bookingService = {
  async createBooking(bookingData: {
    packageId: string;
    travelDate: Date;
    numberOfTravelers: number;
  }) {
    const token = authService.getToken();
    const response = await axios.post(${API_URL}/bookings, bookingData, {
      headers: { Authorization: Bearer ${token} }
    });
    return response.data;
  },

  async getUserBookings() {
    const token = authService.getToken();
    const response = await axios.get(${API_URL}/bookings, {
      headers: { Authorization: Bearer ${token} }
    });
    return response.data;
  },

  async cancelBooking(bookingId: string) {
    const token = authService.getToken();
    const response = await axios.patch(
      ${API_URL}/bookings/${bookingId}/cancel, 
      {}, 
      {
        headers: { Authorization: Bearer ${token} }
      }
    );
    return response.data;
  }
};

