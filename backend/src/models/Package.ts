import mongoose from 'mongoose';

export interface IPackage extends mongoose.Document {
  title: string;
  description: string;
  price: number;
  duration: number; // in days
  destinations: string[];
  availability: number;
  images: string[];
  includedServices: string[];
}

const PackageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  destinations: [{
    type: String,
    trim: true
  }],
  availability: {
    type: Number,
    default: 10
  },
  images: [{
    type: String,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Images must be valid URLs'
    }
  }],
  includedServices: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Package = mongoose.model<IPackage>('Package', PackageSchema);

export default Package;

