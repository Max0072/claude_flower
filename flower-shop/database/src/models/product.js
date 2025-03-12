const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide product description'],
    maxlength: [1000, 'Product description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
    min: [0, 'Price cannot be negative']
  },
  discountPrice: {
    type: Number,
    min: [0, 'Discount price cannot be negative'],
    default: 0
  },
  category: {
    type: String,
    required: [true, 'Please specify product category'],
    enum: {
      values: ['bouquets', 'single-flowers', 'plants', 'gifts', 'seasonal'],
      message: 'Please select correct category'
    }
  },
  tags: [String],
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String
  }],
  stock: {
    type: Number,
    required: [true, 'Please provide product stock'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  attributes: {
    color: [String],
    size: {
      type: String,
      enum: ['small', 'medium', 'large', 'extra-large'],
      default: 'medium'
    },
    materials: [String]
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  featured: {
    type: Boolean,
    default: false
  },
  bestseller: {
    type: Boolean,
    default: false
  },
  new: {
    type: Boolean,
    default: false
  },
  metadata: {
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for optimization
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ 'attributes.color': 1 });
productSchema.index({ price: 1 });
productSchema.index({ isAvailable: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ bestseller: 1 });

// Virtual for calculating if the product is on sale
productSchema.virtual('onSale').get(function() {
  return this.discountPrice > 0 && this.discountPrice < this.price;
});

// Virtual for calculating the discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.discountPrice > 0 && this.price > 0) {
    return Math.round((1 - this.discountPrice / this.price) * 100);
  }
  return 0;
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;