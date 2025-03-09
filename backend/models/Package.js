// models/Package.js
const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  destination: {
    type: String,
    required: [true, 'Please add a destination']
  },
  duration: {
    type: Number,
    required: [true, 'Please add duration in days']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  discount: {
    type: Number,
    default: 0
  },
  images: [String],
  inclusions: [String],
  exclusions: [String],
  itinerary: [{
    day: Number,
    title: String,
    description: String,
    activities: [String]
  }],
  accommodationDetails: {
    type: mongoose.Schema.ObjectId,
    ref: 'ServiceProvider',
    required: true
  },
  transportationDetails: {
    type: mongoose.Schema.ObjectId,
    ref: 'ServiceProvider',
    required: true
  },
  tourGuideDetails: {
    type: mongoose.Schema.ObjectId,
    ref: 'ServiceProvider',
    required: true
  },
  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  featured: {
    type: Boolean,
    default: false
  },
  availability: {
    startDate: Date,
    endDate: Date,
    maxCapacity: Number,
    currentBookings: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Reverse populate with reviews
PackageSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'package',
  justOne: false
});

module.exports = mongoose.model('Package', PackageSchema);
