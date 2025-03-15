import { Package } from './Package';
export interface Booking {
  _id: string;
  package: Package;
  bookingDate: Date;
  travelDate: Date;
  totalPrice: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  paymentStatus: 'Pending' | 'Paid' | 'Refunded';
  numberOfTravelers: number;
}

