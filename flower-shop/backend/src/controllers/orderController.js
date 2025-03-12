const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const Cart = require('../models/cartModel');

/**
 * @desc    Create new order
 * @route   POST /api/v1/orders
 * @access  Private
 */
const createOrder = asyncHandler(async (req, res) => {
  const { 
    items, 
    shippingAddress, 
    paymentMethod 
  } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  // Get user data
  const user = await User.findById(req.user.id);

  // Verify items and calculate prices
  const orderItems = [];
  let itemsPrice = 0;

  for (const item of items) {
    const product = await Product.findById(item.productId);
    
    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${item.productId}`);
    }

    if (!product.inStock) {
      res.status(400);
      throw new Error(`Product not in stock: ${product.name}`);
    }

    const price = product.discountPrice || product.price;
    const orderItem = {
      product: {
        _id: product._id,
        name: product.name,
        price: price,
        image: product.images[0],
      },
      quantity: item.quantity,
      price: price * item.quantity,
    };

    orderItems.push(orderItem);
    itemsPrice += orderItem.price;
  }

  // Calculate other prices
  const shippingPrice = itemsPrice > 3000 ? 0 : 300; // Free shipping for orders over 3000
  const taxPrice = parseFloat((itemsPrice * 0.15).toFixed(2)); // 15% tax
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  // Create the order
  const order = await Order.create({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    status: 'pending',
  });

  // Clear the user's cart after order is created
  await Cart.findOneAndUpdate(
    { user: req.user.id },
    { items: [], totalAmount: 0 }
  );

  res.status(201).json(order);
});

/**
 * @desc    Get order by ID
 * @route   GET /api/v1/orders/:id
 * @access  Private
 */
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    // Check if the order belongs to the user or user is admin
    if (
      order.user._id.toString() !== req.user.id && 
      req.user.role !== 'admin'
    ) {
      res.status(403);
      throw new Error('Not authorized to access this order');
    }

    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

/**
 * @desc    Get all orders for a user
 * @route   GET /api/v1/orders
 * @access  Private
 */
const getUserOrders = asyncHandler(async (req, res) => {
  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const orders = await Order.find({ 'user._id': req.user.id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const count = await Order.countDocuments({ 'user._id': req.user.id });

  res.json({
    orders,
    page,
    pages: Math.ceil(count / limit),
    total: count,
  });
});

/**
 * @desc    Update order to paid
 * @route   PUT /api/v1/orders/:id/pay
 * @access  Private
 */
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    // Check if order belongs to the user or user is admin
    if (
      order.user._id.toString() !== req.user.id && 
      req.user.role !== 'admin'
    ) {
      res.status(403);
      throw new Error('Not authorized to update this order');
    }

    // Check if order already paid
    if (order.isPaid) {
      res.status(400);
      throw new Error('Order is already paid');
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.status = 'processing';
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      updateTime: req.body.update_time,
      email: req.body.payer?.email_address,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

/**
 * @desc    Update order status
 * @route   PUT /api/v1/orders/:id/status
 * @access  Private/Admin
 */
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);

  if (order) {
    // Validate status transition
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      res.status(400);
      throw new Error('Invalid status');
    }

    // Update delivery information if status is shipped
    if (status === 'shipped' && !order.isDelivered) {
      const { trackingNumber, estimatedDelivery, courier } = req.body;
      
      if (!trackingNumber || !estimatedDelivery || !courier) {
        res.status(400);
        throw new Error('Shipping information is required');
      }

      order.deliveryInfo = {
        trackingNumber,
        estimatedDelivery: new Date(estimatedDelivery),
        courier,
      };
    }

    // Update delivered status if status is delivered
    if (status === 'delivered' && !order.isDelivered) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    order.status = status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

/**
 * @desc    Get all orders (admin)
 * @route   GET /api/v1/orders/admin
 * @access  Private/Admin
 */
const getOrders = asyncHandler(async (req, res) => {
  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Filter by status if provided
  const filter = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }

  // Sort options
  let sort = { createdAt: -1 }; // Default: newest first
  if (req.query.sort) {
    switch (req.query.sort) {
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'total_desc':
        sort = { totalPrice: -1 };
        break;
      case 'total_asc':
        sort = { totalPrice: 1 };
        break;
    }
  }

  const orders = await Order.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const count = await Order.countDocuments(filter);

  res.json({
    orders,
    page,
    pages: Math.ceil(count / limit),
    total: count,
  });
});

module.exports = {
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderToPaid,
  updateOrderStatus,
  getOrders,
};