import mongoose from 'mongoose';

export interface IBooking extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  package: mongoose.Types.ObjectId;
  bookingDate: Date;
  travelDate: Date;
  totalPrice: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  paymentStatus: 'Pending' | 'Paid' | 'Refunded';
  numberOfTravelers: number;
}

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: true
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  travelDate: {
    type: Date,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Pending'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Refunded'],
    default: 'Pending'
  },
  numberOfTravelers: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  }
});

const Booking = mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;

