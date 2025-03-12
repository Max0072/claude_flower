const { expect } = require('chai');
const Product = require('../../src/models/Product');

describe('Product Model', () => {
  describe('Validation', () => {
    it('should validate a valid product', async () => {
      const validProduct = new Product({
        name: 'Test Bouquet',
        description: 'A beautiful test bouquet',
        price: 1500,
        category: 'roses',
        images: ['/images/test.jpg'],
        details: {
          composition: ['Red roses - 11'],
          size: 'medium',
          freshness: '7 days',
          careInstructions: 'Keep in water'
        }
      });

      const savedProduct = await validProduct.save();
      expect(savedProduct).to.have.property('_id');
      expect(savedProduct.name).to.equal('Test Bouquet');
      expect(savedProduct.price).to.equal(1500);
    });

    it('should fail when required fields are missing', async () => {
      const invalidProduct = new Product({
        // Missing required fields: name, description, price, category
      });

      let error;
      try {
        await invalidProduct.save();
      } catch (err) {
        error = err;
      }

      expect(error).to.exist;
      expect(error.errors.name).to.exist;
      expect(error.errors.description).to.exist;
      expect(error.errors.price).to.exist;
      expect(error.errors.category).to.exist;
    });

    it('should fail when price is negative', async () => {
      const invalidProduct = new Product({
        name: 'Test Bouquet',
        description: 'A beautiful test bouquet',
        price: -100, // Invalid negative price
        category: 'roses'
      });

      let error;
      try {
        await invalidProduct.save();
      } catch (err) {
        error = err;
      }

      expect(error).to.exist;
      expect(error.errors.price).to.exist;
    });
  });

  describe('Methods', () => {
    it('should correctly identify if product is on sale', () => {
      // Product on sale
      const saleProduct = new Product({
        name: 'Sale Bouquet',
        description: 'A bouquet on sale',
        price: 2000,
        discountPrice: 1500,
        category: 'mixed'
      });
      expect(saleProduct.isOnSale()).to.be.true;

      // Regular product (no discount)
      const regularProduct = new Product({
        name: 'Regular Bouquet',
        description: 'A regular bouquet',
        price: 2000,
        category: 'mixed'
      });
      expect(regularProduct.isOnSale()).to.be.false;

      // Product with discount equal to price
      const noSavingsProduct = new Product({
        name: 'No Savings Bouquet',
        description: 'A bouquet with no real discount',
        price: 2000,
        discountPrice: 2000,
        category: 'mixed'
      });
      expect(noSavingsProduct.isOnSale()).to.be.false;
    });

    it('should calculate correct sale percentage', () => {
      // 25% off
      const product1 = new Product({
        name: 'Sale Bouquet 1',
        description: 'A bouquet on sale',
        price: 2000,
        discountPrice: 1500,
        category: 'mixed'
      });
      expect(product1.getSalePercentage()).to.equal(25);

      // 50% off
      const product2 = new Product({
        name: 'Sale Bouquet 2',
        description: 'A bouquet on sale',
        price: 2000,
        discountPrice: 1000,
        category: 'mixed'
      });
      expect(product2.getSalePercentage()).to.equal(50);

      // No discount
      const product3 = new Product({
        name: 'Regular Bouquet',
        description: 'A regular bouquet',
        price: 2000,
        category: 'mixed'
      });
      expect(product3.getSalePercentage()).to.equal(0);
    });
  });
});