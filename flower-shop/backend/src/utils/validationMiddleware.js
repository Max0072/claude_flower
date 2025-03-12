const { body, validationResult } = require('express-validator');

/**
 * Common validation middleware
 * @param {Array} validations - Array of express-validator validations
 * @returns {Array} - Middleware functions
 */
const validate = (validations) => {
  return [
    // Run all validations
    ...validations,
    // Check for validation errors
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];
};

/**
 * User registration validation rules
 */
const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

/**
 * User login validation rules
 */
const loginValidation = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email'),
  body('password')
    .notEmpty().withMessage('Password is required'),
];

/**
 * Product creation validation rules
 */
const productValidation = [
  body('name')
    .notEmpty().withMessage('Product name is required'),
  body('description')
    .notEmpty().withMessage('Description is required'),
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category')
    .notEmpty().withMessage('Category is required'),
  body('images')
    .isArray().withMessage('Images must be an array')
    .notEmpty().withMessage('At least one image is required'),
];

/**
 * Order creation validation rules
 */
const orderValidation = [
  body('items')
    .isArray().withMessage('Items must be an array')
    .notEmpty().withMessage('Items array cannot be empty'),
  body('items.*.productId')
    .notEmpty().withMessage('Product ID is required'),
  body('items.*.quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress.street')
    .notEmpty().withMessage('Street address is required'),
  body('shippingAddress.city')
    .notEmpty().withMessage('City is required'),
  body('shippingAddress.state')
    .notEmpty().withMessage('State is required'),
  body('shippingAddress.zipCode')
    .notEmpty().withMessage('Zip code is required'),
  body('paymentMethod')
    .notEmpty().withMessage('Payment method is required')
    .isIn(['card', 'cash', 'online']).withMessage('Invalid payment method'),
];

/**
 * Cart item validation rules
 */
const cartItemValidation = [
  body('productId')
    .notEmpty().withMessage('Product ID is required'),
  body('quantity')
    .optional()
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];

/**
 * Review validation rules
 */
const reviewValidation = [
  body('rating')
    .notEmpty().withMessage('Rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment')
    .notEmpty().withMessage('Comment is required'),
];

/**
 * Address validation rules
 */
const addressValidation = [
  body('street')
    .notEmpty().withMessage('Street is required'),
  body('city')
    .notEmpty().withMessage('City is required'),
  body('state')
    .notEmpty().withMessage('State is required'),
  body('zipCode')
    .notEmpty().withMessage('Zip code is required'),
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  productValidation,
  orderValidation,
  cartItemValidation,
  reviewValidation,
  addressValidation,
};