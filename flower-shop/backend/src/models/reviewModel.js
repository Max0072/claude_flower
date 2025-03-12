const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    user: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
      name: {
        type: String,
        required: true,
      },
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for common query patterns
reviewSchema.index({ product: 1 });
reviewSchema.index({ 'user._id': 1, product: 1 }, { unique: true });

// Static method to calculate average rating for a product
reviewSchema.statics.calculateAverageRating = async function(productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    await mongoose.model('Product').findByIdAndUpdate(productId, {
      rating: result[0]?.averageRating || 0,
      numReviews: result[0]?.numReviews || 0,
    });
  } catch (error) {
    console.error('Error updating product rating:', error);
  }
};

// Call calculateAverageRating after save
reviewSchema.post('save', function() {
  this.constructor.calculateAverageRating(this.product);
});

// Call calculateAverageRating after remove
reviewSchema.post('remove', function() {
  this.constructor.calculateAverageRating(this.product);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;