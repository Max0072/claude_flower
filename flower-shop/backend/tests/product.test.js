const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const app = require('../src/server');
const Product = require('../src/models/productModel');
const User = require('../src/models/userModel');
const bcrypt = require('bcryptjs');

chai.use(chaiHttp);

describe('Product API', () => {
  let adminToken;
  let userToken;
  let testProductId;

  // Set up test data before running tests
  before(async () => {
    // Create test admin user
    const hashedPassword = await bcrypt.hash('adminpass123', 10);
    const admin = await User.create({
      name: 'Test Admin',
      email: 'testadmin@example.com',
      password: hashedPassword,
      role: 'admin',
    });

    // Create regular user
    const userHashedPassword = await bcrypt.hash('userpass123', 10);
    const user = await User.create({
      name: 'Test User',
      email: 'testuser@example.com',
      password: userHashedPassword,
      role: 'user',
    });

    // Login as admin to get token
    const adminRes = await chai
      .request(app)
      .post('/api/v1/users/login')
      .send({
        email: 'testadmin@example.com',
        password: 'adminpass123',
      });

    adminToken = adminRes.body.token;

    // Login as regular user to get token
    const userRes = await chai
      .request(app)
      .post('/api/v1/users/login')
      .send({
        email: 'testuser@example.com',
        password: 'userpass123',
      });

    userToken = userRes.body.token;

    // Create test product
    const testProduct = await Product.create({
      name: 'Test Product',
      description: 'This is a test product',
      price: 1000,
      category: 'test',
      images: ['/images/test.jpg'],
      inStock: true,
    });

    testProductId = testProduct._id;
  });

  // Test getting all products
  describe('GET /api/v1/products', () => {
    it('should get all products', (done) => {
      chai
        .request(app)
        .get('/api/v1/products')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('products');
          expect(res.body.products).to.be.an('array');
          done();
        });
    });

    it('should filter products by category', (done) => {
      chai
        .request(app)
        .get('/api/v1/products?category=test')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('products');
          expect(res.body.products).to.be.an('array');
          // All returned products should be in the 'test' category
          res.body.products.forEach(product => {
            expect(product.category).to.equal('test');
          });
          done();
        });
    });
  });

  // Test getting a single product
  describe('GET /api/v1/products/:id', () => {
    it('should get a product by ID', (done) => {
      chai
        .request(app)
        .get(`/api/v1/products/${testProductId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('_id', testProductId.toString());
          expect(res.body).to.have.property('name', 'Test Product');
          done();
        });
    });

    it('should return 404 for non-existent product', (done) => {
      const nonExistentId = '60d21b4667d0d8992e610c85'; // Random valid ObjectId
      chai
        .request(app)
        .get(`/api/v1/products/${nonExistentId}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.error).to.have.property('message', 'Product not found');
          done();
        });
    });
  });

  // Test creating a product (admin only)
  describe('POST /api/v1/products', () => {
    it('should create a new product as admin', (done) => {
      const newProduct = {
        name: 'New Test Product',
        description: 'This is a new test product',
        price: 2000,
        category: 'test',
        images: ['/images/newtest.jpg'],
      };

      chai
        .request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newProduct)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('name', 'New Test Product');
          expect(res.body).to.have.property('price', 2000);
          done();
        });
    });

    it('should not allow regular user to create product', (done) => {
      const newProduct = {
        name: 'Another Test Product',
        description: 'This is another test product',
        price: 1500,
        category: 'test',
        images: ['/images/anothertest.jpg'],
      };

      chai
        .request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newProduct)
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body.error).to.have.property('message', 'Not authorized to access this resource');
          done();
        });
    });
  });

  // Clean up after tests
  after(async () => {
    await User.deleteMany({ 
      email: { $in: ['testadmin@example.com', 'testuser@example.com'] } 
    });
    await Product.deleteMany({ 
      category: 'test' 
    });
  });
});