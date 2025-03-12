const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

/**
 * @desc    Get all products with filtering and pagination
 * @route   GET /api/v1/products
 * @access  Public
 */
const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  // Build query
  const query = {};
  
  // Category filter
  if (req.query.category) {
    query.category = req.query.category;
  }
  
  // Price range filter
  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) query.price.$gte = parseInt(req.query.minPrice);
    if (req.query.maxPrice) query.price.$lte = parseInt(req.query.maxPrice);
  }
  
  // In stock filter
  if (req.query.inStock === 'true') {
    query.inStock = true;
  }
  
  // Featured filter
  if (req.query.featured === 'true') {
    query.featured = true;
  }
  
  // Text search
  if (req.query.search) {
    query.$text = { $search: req.query.search };
  }
  
  // Get total count for pagination
  const total = await Product.countDocuments(query);
  
  // Build sort options
  let sortOption = {};
  if (req.query.sort) {
    switch (req.query.sort) {
      case 'price_asc':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
        sortOption = { price: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'rating':
        sortOption = { rating: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }
  } else {
    // Default sort
    sortOption = { createdAt: -1 };
  }
  
  // Execute query with pagination
  const products = await Product.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limit);
  
  const pages = Math.ceil(total / limit);
  
  res.json({
    products,
    page,
    pages,
    total
  });
});

/**
 * @desc    Get product by ID
 * @route   GET /api/v1/products/:id
 * @access  Public
 */
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

/**
 * @desc    Create a new product
 * @route   POST /api/v1/products
 * @access  Private/Admin
 */
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    discountPrice,
    category,
    subcategory,
    images,
    details,
    inStock,
    featured
  } = req.body;
  
  const product = new Product({
    name,
    description,
    price,
    discountPrice,
    category,
    subcategory,
    images,
    details,
    inStock: inStock !== undefined ? inStock : true,
    featured: featured !== undefined ? featured : false
  });
  
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

/**
 * @desc    Update a product
 * @route   PUT /api/v1/products/:id
 * @access  Private/Admin
 */
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    discountPrice,
    category,
    subcategory,
    images,
    details,
    inStock,
    featured
  } = req.body;
  
  const product = await Product.findById(req.params.id);
  
  if (product) {
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price !== undefined ? price : product.price;
    product.discountPrice = discountPrice !== undefined ? discountPrice : product.discountPrice;
    product.category = category || product.category;
    product.subcategory = subcategory || product.subcategory;
    product.images = images || product.images;
    product.details = details || product.details;
    product.inStock = inStock !== undefined ? inStock : product.inStock;
    product.featured = featured !== undefined ? featured : product.featured;
    
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

/**
 * @desc    Delete a product
 * @route   DELETE /api/v1/products/:id
 * @access  Private/Admin
 */
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
