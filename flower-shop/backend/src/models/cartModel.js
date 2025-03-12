const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, 'Quantity cannot be less than 1'],
          default: 1,
        },
        price: {
          type: Number,
          required: true,
          min: [0, 'Price cannot be negative'],
        },
        name: {
          type: String,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Total amount cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Add unique index for user field
cartSchema.index({ user: 1 }, { unique: true });

// Method to calculate total amount
cartSchema.methods.calculateTotalAmount = function() {
  this.totalAmount = this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  return this.totalAmount;
};

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;