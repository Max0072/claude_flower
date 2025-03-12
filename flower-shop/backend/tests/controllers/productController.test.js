const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const request = require('supertest');
const express = require('express');
const Product = require('../../src/models/Product');
const productController = require('../../src/controllers/productController');

// Create a bare-bones Express app for testing the controller
const createApp = () => {
  const app = express();
  app.use(express.json());
  
  // Define routes for testing
  app.get('/api/v1/products', productController.getProducts);
  app.get('/api/v1/products/:id', productController.getProductById);
  app.post('/api/v1/products', productController.createProduct);
  app.put('/api/v1/products/:id', productController.updateProduct);
  app.delete('/api/v1/products/:id', productController.deleteProduct);
  
  // Error handler middleware
  app.use((err, req, res, next) => {
    res.status(res.statusCode || 500).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  });
  
  return app;
};

describe('Product Controller', () => {
  let app;
  
  before(() => {
    app = createApp();
  });
  
  describe('GET /api/v1/products', () => {
    it('should get all products with default pagination', async () => {
      // Create test products
      await Product.create([
        {
          name: 'Test Product 1',
          description: 'Test Description 1',
          price: 1000,
          category: 'roses',
        },
        {
          name: 'Test Product 2',
          description: 'Test Description 2',
          price: 2000,
          category: 'mixed',
        },
        {
          name: 'Test Product 3',
          description: 'Test Description 3',
          price: 3000,
          category: 'tulips',
        },
      ]);
      
      const res = await request(app).get('/api/v1/products');
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('products').to.be.an('array');
      expect(res.body.products).to.have.lengthOf(3);
      expect(res.body).to.have.property('page', 1);
      expect(res.body).to.have.property('total', 3);
    });
    
    it('should filter products by category', async () => {
      const res = await request(app).get('/api/v1/products?category=roses');
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('products').to.be.an('array');
      expect(res.body.products).to.have.lengthOf(1);
      expect(res.body.products[0]).to.have.property('name', 'Test Product 1');
    });
    
    it('should sort products by price (ascending)', async () => {
      const res = await request(app).get('/api/v1/products?sort=price_asc');
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('products').to.be.an('array');
      expect(res.body.products).to.have.lengthOf(3);
      expect(res.body.products[0]).to.have.property('price', 1000);
      expect(res.body.products[1]).to.have.property('price', 2000);
      expect(res.body.products[2]).to.have.property('price', 3000);
    });
    
    it('should sort products by price (descending)', async () => {
      const res = await request(app).get('/api/v1/products?sort=price_desc');
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('products').to.be.an('array');
      expect(res.body.products).to.have.lengthOf(3);
      expect(res.body.products[0]).to.have.property('price', 3000);
      expect(res.body.products[1]).to.have.property('price', 2000);
      expect(res.body.products[2]).to.have.property('price', 1000);
    });
  });
  
  describe('GET /api/v1/products/:id', () => {
    let productId;
    
    before(async () => {
      // Create a test product
      const product = await Product.create({
        name: 'Single Test Product',
        description: 'Single Test Description',
        price: 1500,
        category: 'premium',
      });
      
      productId = product._id;
    });
    
    it('should get a single product by ID', async () => {
      const res = await request(app).get(`/api/v1/products/${productId}`);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('_id', productId.toString());
      expect(res.body).to.have.property('name', 'Single Test Product');
      expect(res.body).to.have.property('price', 1500);
    });
    
    it('should return 404 for non-existent product ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/v1/products/${nonExistentId}`);
      
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message', 'Product not found');
    });
  });
  
  describe('POST /api/v1/products', () => {
    it('should create a new product', async () => {
      const newProduct = {
        name: 'New Test Product',
        description: 'New Test Description',
        price: 2500,
        category: 'premium',
        images: ['/images/test.jpg'],
        details: {
          composition: ['Test flowers - 5'],
          size: 'small',
        },
      };
      
      const res = await request(app)
        .post('/api/v1/products')
        .send(newProduct);
      
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('_id');
      expect(res.body).to.have.property('name', newProduct.name);
      expect(res.body).to.have.property('price', newProduct.price);
      expect(res.body).to.have.property('inStock', true); // Default value
      expect(res.body).to.have.property('featured', false); // Default value
      
      // Verify it was saved to the database
      const savedProduct = await Product.findById(res.body._id);
      expect(savedProduct).to.exist;
      expect(savedProduct.name).to.equal(newProduct.name);
    });
    
    it('should reject invalid product data', async () => {
      const invalidProduct = {
        // Missing required fields
        description: 'Invalid Test Description',
      };
      
      const res = await request(app)
        .post('/api/v1/products')
        .send(invalidProduct);
      
      expect(res.status).to.be.at.least(400);
    });
  });
  
  // Clean up after all tests
  after(async () => {
    await Product.deleteMany({});
  });
});