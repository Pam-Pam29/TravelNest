const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  package: {
    type: mongoose.Schema.ObjectId,
    ref: 'Package',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  travelDate: {
    type: Date,
    required: [true, 'Please add a travel date']
  },
  numberOfTravelers: {
    type: Number,
    required: [true, 'Please add number of travelers']
  },
  totalPrice: {
    type: Number,
    required: true
  },
  paymentInfo: {
    id: String,
    status: String,
    updateTime: String,
    emailAddress: String
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  specialRequests: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', BookingSchema);
