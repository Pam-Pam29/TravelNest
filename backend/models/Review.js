const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title for the review'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  text: {
    type: String,
    required: [true, 'Please add some text']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please add a rating between 1 and 5']
  },
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent user from submitting more than one review per package
ReviewSchema.index({ package: 1, user: 1 }, { unique: true });

// Static method to get avg rating and save
ReviewSchema.statics.getAverageRating = async function(packageId) {
  const obj = await this.aggregate([
    {
      $match: { package: packageId }
    },
    {
      $group: {
        _id: '$package',
        averageRating: { $avg: '$rating' }
      }
    }
  ]);

  try {
    await this.model('Package').findByIdAndUpdate(packageId, {
      averageRating: obj[0].averageRating
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageCost after save
ReviewSchema.post('save', async function() {
  await this.constructor.getAverageRating(this.package);
});

// Call getAverageCost before remove
ReviewSchema.pre('remove', async function() {
  await this.constructor.getAverageRating(this.package);
});

module.exports = mongoose.model('Review', ReviewSchema);
