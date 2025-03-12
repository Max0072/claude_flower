const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
    orderItems: [
      {
        product: {
          _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product',
          },
          name: { type: String, required: true },
          price: { type: Number, required: true },
          image: { type: String, required: true },
        },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: [true, 'Please provide a payment method'],
      enum: ['card', 'cash', 'online'],
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      updateTime: { type: String },
      email: { type: String },
    },
    itemsPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    deliveryInfo: {
      trackingNumber: { type: String },
      estimatedDelivery: { type: Date },
      courier: { type: String },
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for common query patterns
orderSchema.index({ user: 1 });
orderSchema.index({ 'paymentResult.id': 1 });
orderSchema.index({ status: 1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;