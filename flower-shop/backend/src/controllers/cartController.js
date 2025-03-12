const asyncHandler = require('express-async-handler');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

/**
 * @desc    Get cart items
 * @route   GET /api/v1/cart
 * @access  Private
 */
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user.id });

  // If cart doesn't exist, create a new empty cart
  if (!cart) {
    cart = await Cart.create({
      user: req.user.id,
      items: [],
      totalAmount: 0,
    });
  }

  res.json({
    items: cart.items,
    totalAmount: cart.totalAmount,
  });
});

/**
 * @desc    Add item to cart
 * @route   POST /api/v1/cart
 * @access  Private
 */
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  // Validate product exists
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if product is in stock
  if (!product.inStock) {
    res.status(400);
    throw new Error('Product is out of stock');
  }

  // Get user's cart or create new one
  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    cart = new Cart({
      user: req.user.id,
      items: [],
      totalAmount: 0,
    });
  }

  // Check if product already in cart
  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  const price = product.discountPrice || product.price;

  if (existingItemIndex >= 0) {
    // Update existing item quantity
    cart.items[existingItemIndex].quantity += quantity;
    cart.items[existingItemIndex].price = price;
  } else {
    // Add new item to cart
    cart.items.push({
      product: productId,
      quantity,
      price,
      name: product.name,
      image: product.images[0],
    });
  }

  // Calculate total
  cart.totalAmount = cart.calculateTotalAmount();
  
  // Save cart
  await cart.save();

  res.status(201).json({
    items: cart.items,
    totalAmount: cart.totalAmount,
  });
});

/**
 * @desc    Update cart item quantity
 * @route   PUT /api/v1/cart/:id
 * @access  Private
 */
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const productId = req.params.id;

  // Validate quantity
  if (quantity <= 0) {
    res.status(400);
    throw new Error('Quantity must be greater than 0');
  }

  // Get user's cart
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  // Find item in cart
  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    res.status(404);
    throw new Error('Item not found in cart');
  }

  // Update quantity
  cart.items[itemIndex].quantity = quantity;
  
  // Calculate total
  cart.totalAmount = cart.calculateTotalAmount();
  
  // Save cart
  await cart.save();

  res.json({
    items: cart.items,
    totalAmount: cart.totalAmount,
  });
});

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/v1/cart/:id
 * @access  Private
 */
const removeFromCart = asyncHandler(async (req, res) => {
  const productId = req.params.id;

  // Get user's cart
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  // Remove item from cart
  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );
  
  // Calculate total
  cart.totalAmount = cart.calculateTotalAmount();
  
  // Save cart
  await cart.save();

  res.json({
    items: cart.items,
    totalAmount: cart.totalAmount,
    message: 'Item removed from cart',
  });
});

/**
 * @desc    Clear cart
 * @route   DELETE /api/v1/cart
 * @access  Private
 */
const clearCart = asyncHandler(async (req, res) => {
  // Get user's cart
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  // Clear cart items
  cart.items = [];
  cart.totalAmount = 0;
  
  // Save cart
  await cart.save();

  res.json({
    message: 'Cart cleared',
    items: [],
    totalAmount: 0,
  });
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};