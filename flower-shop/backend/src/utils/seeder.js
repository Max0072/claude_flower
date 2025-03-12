const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Review = require('../models/reviewModel');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/flora-shop')
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Sample users
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'admin',
    phone: '9876543210',
    addresses: [
      {
        street: 'Admin Street 1',
        city: 'Admin City',
        state: 'Admin State',
        zipCode: '123456',
        isDefault: true,
      },
    ],
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'user',
    phone: '1234567890',
    addresses: [
      {
        street: 'User Street 1',
        city: 'User City',
        state: 'User State',
        zipCode: '654321',
        isDefault: true,
      },
    ],
  },
];

// Sample products
const products = [
  {
    name: 'Red Rose Bouquet',
    description: 'A beautiful bouquet of fresh red roses',
    price: 1500,
    discountPrice: 1200,
    category: 'roses',
    subcategory: 'bouquets',
    images: ['/images/red-roses.jpg'],
    details: {
      composition: ['Red roses - 12 stems'],
      size: 'Medium',
      freshness: '7 days',
      careInstructions: 'Keep in water and change water every 2 days',
    },
    inStock: true,
    featured: true,
  },
  {
    name: 'Mixed Flower Basket',
    description: 'A basket of mixed seasonal flowers',
    price: 2000,
    category: 'mixed',
    subcategory: 'baskets',
    images: ['/images/mixed-basket.jpg'],
    details: {
      composition: [
        'Pink roses - 5 stems',
        'White lilies - 3 stems',
        'Yellow chrysanthemums - 5 stems',
      ],
      size: 'Large',
      freshness: '5 days',
      careInstructions: 'Keep in a cool place away from direct sunlight',
    },
    inStock: true,
    featured: true,
  },
  {
    name: 'Tulip Collection',
    description: 'Colorful collection of fresh tulips',
    price: 1800,
    discountPrice: 1500,
    category: 'tulips',
    subcategory: 'bouquets',
    images: ['/images/tulips.jpg'],
    details: {
      composition: ['Mixed color tulips - 15 stems'],
      size: 'Medium',
      freshness: '6 days',
      careInstructions: 'Keep in water in a cool place',
    },
    inStock: true,
    featured: false,
  },
  {
    name: 'White Orchid Plant',
    description: 'Elegant white orchid in a decorative pot',
    price: 3500,
    category: 'plants',
    subcategory: 'orchids',
    images: ['/images/orchid.jpg'],
    details: {
      composition: ['White Phalaenopsis orchid'],
      size: 'Medium',
      freshness: 'Long-lasting (weeks)',
      careInstructions: 'Water once a week. Place in indirect light.',
    },
    inStock: true,
    featured: true,
  },
  {
    name: 'Sympathy Wreath',
    description: 'Elegant sympathy wreath for funeral services',
    price: 4000,
    category: 'sympathy',
    subcategory: 'wreaths',
    images: ['/images/wreath.jpg'],
    details: {
      composition: [
        'White lilies', 
        'White roses', 
        'White chrysanthemums',
        'Green foliage',
      ],
      size: 'Large',
      freshness: '3-4 days',
      careInstructions: 'Keep in a cool place',
    },
    inStock: true,
    featured: false,
  },
];

// Import seed data
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Cart.deleteMany();
    await Review.deleteMany();

    // Insert sample data
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    const sampleProducts = products.map(product => {
      return { ...product };
    });

    await Product.insertMany(sampleProducts);

    console.log('Data imported successfully');
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error.message}`);
    process.exit(1);
  }
};

// Delete all data
const destroyData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Cart.deleteMany();
    await Review.deleteMany();

    console.log('Data destroyed successfully');
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

// Run script based on command line argument
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}