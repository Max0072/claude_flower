const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: [true, 'Discount type is required']
  },
  amount: {
    type: Number,
    required: [true, 'Discount amount is required'],
    min: [0, 'Discount amount cannot be negative']
  },
  minPurchase: {
    type: Number,
    default: 0,
    min: [0, 'Minimum purchase amount cannot be negative']
  },
  maxDiscount: {
    type: Number,
    default: null
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    default: Date.now
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  usageLimit: {
    type: Number,
    default: null
  },
  usageCount: {
    type: Number,
    default: 0
  },
  perUserLimit: {
    type: Number,
    default: null
  },
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  applicableCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  excludedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  users: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    usageCount: {
      type: Number,
      default: 0
    }
  }],
  firstTimeOnly: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for optimization
couponSchema.index({ code: 1 }, { unique: true });
couponSchema.index({ isActive: 1 });
couponSchema.index({ startDate: 1, endDate: 1 });
couponSchema.index({ 'users.user': 1 });

// Virtual for checking if coupon is expired
couponSchema.virtual('isExpired').get(function() {
  return Date.now() > this.endDate;
});

// Virtual for checking if coupon is valid (active and not expired)
couponSchema.virtual('isValid').get(function() {
  return this.isActive && !this.isExpired && 
         (this.usageLimit === null || this.usageCount < this.usageLimit) &&
         Date.now() >= this.startDate && Date.now() <= this.endDate;
});

// Check if coupon can be used by a specific user
couponSchema.methods.isValidForUser = function(userId) {
  if (!this.isValid) return false;
  
  // Check if user has already used the coupon
  const userUsage = this.users.find(u => u.user.toString() === userId.toString());
  
  // If first time only and user has used it before
  if (this.firstTimeOnly && userUsage) {
    return false;
  }
  
  // Check user limit
  if (this.perUserLimit !== null && userUsage && userUsage.usageCount >= this.perUserLimit) {
    return false;
  }
  
  return true;
};

// Calculate discount amount for an order
couponSchema.methods.calculateDiscount = function(subtotal) {
  // Check minimum purchase requirement
  if (subtotal < this.minPurchase) {
    return 0;
  }
  
  let discount = 0;
  
  if (this.type === 'percentage') {
    discount = (subtotal * this.amount) / 100;
    // Apply max discount if set
    if (this.maxDiscount !== null && discount > this.maxDiscount) {
      discount = this.maxDiscount;
    }
  } else {
    // Fixed amount discount
    discount = this.amount;
    // Ensure discount is not more than subtotal
    if (discount > subtotal) {
      discount = subtotal;
    }
  }
  
  return discount;
};

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;