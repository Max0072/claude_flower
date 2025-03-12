# Flora Shop Backend API

Backend API for the Flora online flower shop application.

## Features

- RESTful API with Express
- MongoDB database with Mongoose ODM
- User authentication with JWT
- Role-based authorization
- Input validation
- Error handling
- API documentation with Swagger
- File uploads
- Testing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd flower-shop/backend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Copy the `.env.example` file to `.env` and configure your environment variables.

```bash
cp .env.example .env
```

4. Start MongoDB:

Ensure that your MongoDB server is running.

## Usage

### Development

To run the server in development mode with hot reloading:

```bash
npm run dev
```

### Production

To run the server in production mode:

```bash
npm start
```

### Database Seeding

To seed the database with sample data:

```bash
npm run seed
```

To clear all data from the database:

```bash
npm run seed:destroy
```

### Testing

To run tests:

```bash
npm test
```

### Linting

To run the linter:

```bash
npm run lint
```

## API Documentation

API documentation is available at `/api-docs` when the server is running. For example, if your server is running on port 5000, you can access the API documentation at:

```
http://localhost:5000/api-docs
```

## API Endpoints

### Authentication

- `POST /api/v1/users/register` - Register a new user
- `POST /api/v1/users/login` - Authenticate user and get token

### Users

- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile
- `POST /api/v1/users/address` - Add a new address
- `PUT /api/v1/users/address/:id` - Update an address
- `DELETE /api/v1/users/address/:id` - Delete an address

### Products

- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/featured` - Get featured products
- `GET /api/v1/products/:id` - Get a product by ID
- `POST /api/v1/products` - Create a new product (Admin only)
- `PUT /api/v1/products/:id` - Update a product (Admin only)
- `DELETE /api/v1/products/:id` - Delete a product (Admin only)
- `POST /api/v1/products/:id/reviews` - Add a review to a product

### Orders

- `POST /api/v1/orders` - Create a new order
- `GET /api/v1/orders` - Get all orders for the logged-in user
- `GET /api/v1/orders/:id` - Get an order by ID
- `PUT /api/v1/orders/:id/pay` - Update order to paid
- `PUT /api/v1/orders/:id/status` - Update order status (Admin only)
- `GET /api/v1/orders/admin` - Get all orders (Admin only)

### Cart

- `GET /api/v1/cart` - Get cart items
- `POST /api/v1/cart` - Add item to cart
- `PUT /api/v1/cart/:id` - Update cart item quantity
- `DELETE /api/v1/cart/:id` - Remove item from cart
- `DELETE /api/v1/cart` - Clear cart