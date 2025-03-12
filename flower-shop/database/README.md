# Flora Shop Database Module

This module contains database models, configuration, and utilities for the Flora online flower shop application.

## Architecture

The database module uses MongoDB with Mongoose as the ODM (Object Document Mapper). It provides:

- Data models with validation
- Schema definitions
- Indexes for query optimization
- Virtual properties
- Pre/post hooks
- Custom methods for business logic

## Models

### Product
Represents products available in the flower shop:
- Name, description, price
- Categories and tags
- Stock management
- Attributes (color, size, materials)
- Images and ratings

### User
Handles user data with security features:
- Authentication info with hashed passwords
- Profile details
- Shipping addresses
- Wishlist management
- Email verification

### Order
Manages customer orders:
- Order items with product references
- Shipping and billing details
- Payment information
- Delivery tracking
- Order status and history
- Invoice generation

### Review
Product review system:
- Ratings and comments
- Verified purchase validation
- Moderation workflow
- Automatic average rating calculation

### Category
Product categorization:
- Hierarchical categories with parent/child relationships
- Automatic slug generation
- SEO-friendly attributes
- Featured categories

### Coupon
Discount system:
- Multiple discount types (percentage, fixed amount)
- Validity periods
- Usage limits (global and per-user)
- Product/category restrictions
- Minimum purchase requirements

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Configure environment variables:
   - `MONGO_URI`: MongoDB connection string

3. Import the module:
   ```javascript
   const { connectDB, Product, User, Order } = require('./database');
   
   // Connect to the database
   connectDB()
     .then(() => console.log('Database connected'))
     .catch(err => console.error('Database connection error:', err));
   ```

## Usage Examples

### Creating a new product:
```javascript
const { Product } = require('./database');

const newProduct = new Product({
  name: 'Rose Bouquet',
  description: 'Beautiful bouquet of fresh red roses',
  price: 29.99,
  category: 'bouquets',
  stock: 10,
  images: [{ url: 'images/rose-bouquet.jpg', alt: 'Rose Bouquet' }],
  attributes: {
    color: ['red'],
    size: 'medium'
  }
});

await newProduct.save();
```

### Finding products:
```javascript
// Find all available products
const products = await Product.find({ isAvailable: true });

// Find products with pagination and sorting
const paginatedProducts = await Product
  .find({ category: 'bouquets' })
  .sort({ price: 1 })
  .skip(10)
  .limit(10);

// Find products with text search
const searchResults = await Product.find({
  $text: { $search: 'rose red' }
});
```

### Processing an order:
```javascript
const { Order } = require('./database');

const order = new Order({
  user: userId,
  items: [
    {
      product: productId,
      name: 'Rose Bouquet',
      price: 29.99,
      quantity: 1,
      image: 'images/rose-bouquet.jpg'
    }
  ],
  shippingAddress: { ... },
  billingAddress: { ... },
  payment: {
    method: 'credit_card',
    status: 'pending'
  },
  delivery: {
    method: 'standard',
    price: 4.99
  },
  subtotal: 29.99,
  tax: 3.50,
  total: 38.48
});

await order.save();
```

## Indexes

The database schemas include optimized indexes for common queries:
- Text search on product names and descriptions
- Category-based filtering
- Status-based filtering (active products, order status)
- Date-based sorting and filtering

## Data Relationships

The models maintain relationships through MongoDB references:
- Products belong to Categories
- Orders contain Products
- Reviews are linked to Products and Users
- Coupons can be applied to specific Products or Categories