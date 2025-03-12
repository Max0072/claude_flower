const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

/**
 * @desc    Register a new user
 * @route   POST /api/v1/users/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id, user.role),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/v1/users/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id, user.role),
  });
});

/**
 * @desc    Get user profile
 * @route   GET /api/v1/users/profile
 * @access  Private
 */
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      addresses: user.addresses,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc    Update user profile
 * @route   PUT /api/v1/users/profile
 * @access  Private
 */
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    
    // Only update password if it's sent in the request
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      token: generateToken(updatedUser._id, updatedUser.role),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc    Add address to user profile
 * @route   POST /api/v1/users/address
 * @access  Private
 */
const addUserAddress = asyncHandler(async (req, res) => {
  const { street, city, state, zipCode, isDefault } = req.body;
  
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // If new address is default, remove default flag from other addresses
  if (isDefault) {
    user.addresses.forEach(address => {
      address.isDefault = false;
    });
  }

  // Add new address
  user.addresses.push({
    street,
    city,
    state,
    zipCode,
    isDefault: isDefault || false,
  });

  await user.save();

  res.status(201).json({
    addresses: user.addresses,
  });
});

/**
 * @desc    Update user address
 * @route   PUT /api/v1/users/address/:id
 * @access  Private
 */
const updateUserAddress = asyncHandler(async (req, res) => {
  const addressId = req.params.id;
  const { street, city, state, zipCode, isDefault } = req.body;
  
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Find address in user's addresses
  const address = user.addresses.id(addressId);

  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }

  // If updated address is default, remove default flag from other addresses
  if (isDefault && !address.isDefault) {
    user.addresses.forEach(addr => {
      addr.isDefault = false;
    });
  }

  // Update address
  address.street = street || address.street;
  address.city = city || address.city;
  address.state = state || address.state;
  address.zipCode = zipCode || address.zipCode;
  address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

  await user.save();

  res.json({
    addresses: user.addresses,
  });
});

/**
 * @desc    Delete user address
 * @route   DELETE /api/v1/users/address/:id
 * @access  Private
 */
const deleteUserAddress = asyncHandler(async (req, res) => {
  const addressId = req.params.id;
  
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Find and remove address
  const address = user.addresses.id(addressId);

  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }

  address.remove();
  await user.save();

  res.json({
    message: 'Address removed',
    addresses: user.addresses,
  });
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
};