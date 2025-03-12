const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  rating: {
    type: Number,
    required: [true, 'Please provide rating'],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: [true, 'Please provide review title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Please provide review comment'],
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  photos: [{
    url: String,
    alt: String
  }],
  verified: {
    type: Boolean,
    default: false
  },
  helpfulVotes: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminResponse: {
    comment: String,
    createdAt: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Prevent duplicate reviews from the same user for the same product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });
reviewSchema.index({ product: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ status: 1 });
reviewSchema.index({ createdAt: -1 });

// Calculate average rating and update product after each review
reviewSchema.statics.calcAverageRating = async function(productId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId, status: 'approved' }
    },
    {
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating' },
        nRating: { $sum: 1 }
      }
    }
  ]);

  // Update product with new average rating and count
  if (stats.length > 0) {
    await mongoose.model('Product').findByIdAndUpdate(productId, {
      'rating.average': stats[0].avgRating.toFixed(1),
      'rating.count': stats[0].nRating
    });
  } else {
    // If no reviews, reset rating
    await mongoose.model('Product').findByIdAndUpdate(productId, {
      'rating.average': 0,
      'rating.count': 0
    });
  }
};

// Call calcAverageRating after save
reviewSchema.post('save', function() {
  this.constructor.calcAverageRating(this.product);
});

// Call calcAverageRating before remove
reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function() {
  if (this.r) await this.r.constructor.calcAverageRating(this.r.product);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;