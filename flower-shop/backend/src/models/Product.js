const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price must be a positive number'],
    },
    discountPrice: {
      type: Number,
      min: [0, 'Discount price must be a positive number'],
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
    },
    subcategory: {
      type: String,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    details: {
      composition: [String],
      size: String,
      freshness: String,
      careInstructions: String,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for product search
productSchema.index({ name: 'text', description: 'text' });

// Add method to calculate if product is on sale
productSchema.methods.isOnSale = function() {
  return this.discountPrice !== undefined && this.discountPrice < this.price;
};

// Add method to get sale percentage
productSchema.methods.getSalePercentage = function() {
  if (!this.isOnSale()) {
    return 0;
  }
  return Math.round(((this.price - this.discountPrice) / this.price) * 100);
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;