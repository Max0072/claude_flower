const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const app = require('../src/server');
const User = require('../src/models/userModel');

chai.use(chaiHttp);

describe('User API', () => {
  // Clean up before tests
  before(async () => {
    await User.deleteMany({ email: 'test@example.com' });
  });

  // Test user registration
  describe('POST /api/v1/users/register', () => {
    it('should register a new user', (done) => {
      const user = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      chai
        .request(app)
        .post('/api/v1/users/register')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('id');
          expect(res.body).to.have.property('name', 'Test User');
          expect(res.body).to.have.property('email', 'test@example.com');
          expect(res.body).to.have.property('token');
          done();
        });
    });

    it('should not register a user with existing email', (done) => {
      const user = {
        name: 'Another Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      chai
        .request(app)
        .post('/api/v1/users/register')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('success', false);
          expect(res.body.error).to.have.property('message', 'User already exists');
          done();
        });
    });

    it('should not register a user with missing fields', (done) => {
      const user = {
        name: 'Incomplete User',
        email: 'incomplete@example.com',
        // Missing password
      };

      chai
        .request(app)
        .post('/api/v1/users/register')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.be.an('array');
          done();
        });
    });
  });

  // Test user login
  describe('POST /api/v1/users/login', () => {
    it('should login an existing user', (done) => {
      const loginCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      chai
        .request(app)
        .post('/api/v1/users/login')
        .send(loginCredentials)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('id');
          expect(res.body).to.have.property('email', 'test@example.com');
          expect(res.body).to.have.property('token');
          done();
        });
    });

    it('should not login with incorrect password', (done) => {
      const loginCredentials = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      chai
        .request(app)
        .post('/api/v1/users/login')
        .send(loginCredentials)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.error).to.have.property('message', 'Invalid email or password');
          done();
        });
    });

    it('should not login with non-existent email', (done) => {
      const loginCredentials = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      chai
        .request(app)
        .post('/api/v1/users/login')
        .send(loginCredentials)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.error).to.have.property('message', 'Invalid email or password');
          done();
        });
    });
  });

  // Clean up after tests
  after(async () => {
    await User.deleteMany({ email: 'test@example.com' });
  });
});