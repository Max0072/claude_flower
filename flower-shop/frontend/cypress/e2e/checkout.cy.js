/// <reference types="cypress" />

describe('Checkout Process', () => {
  beforeEach(() => {
    // Login and set up cart with items
    cy.intercept('POST', '/api/v1/users/login', {
      statusCode: 200,
      body: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        token: 'fake-jwt-token'
      }
    }).as('login');
    
    cy.intercept('GET', '/api/v1/cart', {
      statusCode: 200,
      body: {
        items: [
          {
            productId: '1',
            name: 'Букет роз',
            price: 1500,
            quantity: 2,
            imageUrl: '/images/bouquet1.jpg'
          }
        ],
        totalAmount: 3000
      }
    }).as('getCart');
    
    // Login
    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="login-button"]').click();
    cy.wait('@login');
    
    // Navigate to cart
    cy.visit('/cart');
    cy.wait('@getCart');
  });
  
  it('allows user to complete checkout process', () => {
    // Verify cart contents
    cy.get('[data-testid="cart-item"]').should('have.length', 1);
    cy.get('[data-testid="cart-total"]').should('contain', '3000');
    
    // Click checkout button
    cy.get('[data-testid="checkout-button"]').click();
    
    // Mock shipping methods API
    cy.intercept('GET', '/api/v1/shipping/methods', {
      statusCode: 200,
      body: [
        { id: '1', name: 'Стандартная доставка', price: 300 },
        { id: '2', name: 'Экспресс доставка', price: 500 }
      ]
    }).as('getShippingMethods');
    
    // Verify on shipping page
    cy.url().should('include', '/checkout/shipping');
    cy.wait('@getShippingMethods');
    
    // Fill shipping address
    cy.get('[data-testid="street-input"]').type('ул. Ленина 10');
    cy.get('[data-testid="city-input"]').type('Москва');
    cy.get('[data-testid="state-input"]').type('Москва');
    cy.get('[data-testid="zipcode-input"]').type('123456');
    
    // Select shipping method
    cy.get('[data-testid="shipping-method"]').first().click();
    
    // Continue to payment
    cy.get('[data-testid="continue-button"]').click();
    
    // Mock payment methods API
    cy.intercept('GET', '/api/v1/payment/methods', {
      statusCode: 200,
      body: [
        { id: 'card', name: 'Кредитная карта' },
        { id: 'cash', name: 'Наличными при получении' }
      ]
    }).as('getPaymentMethods');
    
    // Verify on payment page
    cy.url().should('include', '/checkout/payment');
    cy.wait('@getPaymentMethods');
    
    // Select payment method
    cy.get('[data-testid="payment-method"]').first().click();
    
    // Fill card details
    cy.get('[data-testid="card-number-input"]').type('4242424242424242');
    cy.get('[data-testid="card-name-input"]').type('Test User');
    cy.get('[data-testid="card-expiry-input"]').type('12/25');
    cy.get('[data-testid="card-cvc-input"]').type('123');
    
    // Mock order creation
    cy.intercept('POST', '/api/v1/orders', {
      statusCode: 201,
      body: {
        id: 'order123',
        items: [
          {
            productId: '1',
            name: 'Букет роз',
            price: 1500,
            quantity: 2
          }
        ],
        shippingAddress: {
          street: 'ул. Ленина 10',
          city: 'Москва',
          state: 'Москва',
          zipCode: '123456'
        },
        paymentMethod: 'card',
        itemsPrice: 3000,
        shippingPrice: 300,
        totalPrice: 3300,
        isPaid: true,
        paidAt: new Date().toISOString(),
        status: 'processing'
      }
    }).as('createOrder');
    
    // Submit order
    cy.get('[data-testid="place-order-button"]').click();
    cy.wait('@createOrder');
    
    // Verify success page
    cy.url().should('include', '/checkout/success');
    cy.get('[data-testid="order-success"]').should('be.visible');
    cy.get('[data-testid="order-number"]').should('contain', 'order123');
    cy.get('[data-testid="order-total"]').should('contain', '3300');
  });
  
  it('validates required fields during checkout', () => {
    // Start checkout
    cy.get('[data-testid="checkout-button"]').click();
    
    // Try to continue without filling shipping address
    cy.get('[data-testid="continue-button"]').click();
    
    // Verify validation errors
    cy.get('[data-testid="street-error"]').should('be.visible');
    cy.get('[data-testid="city-error"]').should('be.visible');
    cy.get('[data-testid="zipcode-error"]').should('be.visible');
  });
});