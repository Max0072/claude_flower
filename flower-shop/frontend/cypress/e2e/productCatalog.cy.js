/// <reference types="cypress" />

describe('Product Catalog', () => {
  beforeEach(() => {
    // Mock API response for products
    cy.intercept('GET', '/api/v1/products*', {
      fixture: 'products.json'
    }).as('getProducts');
    
    // Visit the home page
    cy.visit('/');
  });
  
  it('displays product catalog on the home page', () => {
    // Wait for the API request to complete
    cy.wait('@getProducts');
    
    // Check if products are rendered
    cy.get('[data-testid="product-card"]').should('have.length.at.least', 1);
    
    // Check product details
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('.product-name').should('be.visible');
      cy.get('.product-price').should('be.visible');
      cy.get('img').should('be.visible');
      cy.get('[data-testid="add-to-cart-button"]').should('be.visible');
    });
  });
  
  it('allows filtering products by category', () => {
    // Wait for the products to load
    cy.wait('@getProducts');
    
    // Mock API response for filtered products
    cy.intercept('GET', '/api/v1/products?category=roses*', {
      fixture: 'filtered-products.json'
    }).as('getFilteredProducts');
    
    // Click on category filter
    cy.get('[data-testid="category-filter"]').contains('Розы').click();
    
    // Wait for the filtered results
    cy.wait('@getFilteredProducts');
    
    // Verify filtered results are displayed
    cy.get('[data-testid="product-card"]').should('have.length.at.least', 1);
    cy.get('.product-category').should('contain', 'roses');
  });
  
  it('navigates to product details when product is clicked', () => {
    // Wait for the products to load
    cy.wait('@getProducts');
    
    // Mock API response for single product
    cy.intercept('GET', '/api/v1/products/*', {
      fixture: 'product-detail.json'
    }).as('getProductDetail');
    
    // Click on the first product
    cy.get('[data-testid="product-card"]').first().click();
    
    // Wait for product detail to load
    cy.wait('@getProductDetail');
    
    // Verify product detail page
    cy.url().should('include', '/product/');
    cy.get('[data-testid="product-detail"]').should('be.visible');
    cy.get('[data-testid="product-title"]').should('be.visible');
    cy.get('[data-testid="product-price"]').should('be.visible');
    cy.get('[data-testid="product-description"]').should('be.visible');
  });
  
  it('adds product to cart when add-to-cart button is clicked', () => {
    // Wait for the products to load
    cy.wait('@getProducts');
    
    // Mock API response for adding to cart
    cy.intercept('POST', '/api/v1/cart', {
      statusCode: 200,
      body: {
        message: 'Product added to cart'
      }
    }).as('addToCart');
    
    // Click the "Add to Cart" button on the first product
    cy.get('[data-testid="add-to-cart-button"]').first().click();
    
    // Wait for the add to cart API request
    cy.wait('@addToCart');
    
    // Verify cart notification
    cy.get('[data-testid="cart-notification"]').should('be.visible');
    cy.get('[data-testid="cart-count"]').should('have.text', '1');
  });
});