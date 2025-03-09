const mongoose = require('mongoose');

const ServiceProviderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  type: {
    type: String,
    enum: ['hotel', 'transport', 'tour-guide'],
    required: [true, 'Please specify the type of service']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  contactEmail: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  contactPhone: {
    type: String,
    required: [true, 'Please add a contact phone number']
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    },
    formattedAddress: String,
    city: String,
    state: String,
    zipcode: String,
    country: String
  },
  services: [String],
  images: [String],
  verified: {
    type: Boolean,
    default: false
  },
  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ServiceProvider', ServiceProviderSchema);
