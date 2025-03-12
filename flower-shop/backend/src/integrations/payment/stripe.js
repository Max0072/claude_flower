const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const logger = require('../../utils/logger');

/**
 * Creates a payment intent for a new order
 * @param {Object} orderData - Order information for the payment
 * @param {number} orderData.amount - Payment amount in cents
 * @param {string} orderData.currency - Currency code (default: 'usd')
 * @param {string} orderData.orderId - The order ID to associate with this payment
 * @param {Object} orderData.customer - Customer information
 * @returns {Promise<Object>} Stripe payment intent object
 */
exports.createPaymentIntent = async (orderData) => {
  try {
    const { amount, currency = 'usd', orderId, customer } = orderData;
    
    // Validate amount
    if (!amount || amount <= 0) {
      throw new Error('Invalid payment amount');
    }
    
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: { 
        orderId,
        customerEmail: customer.email
      },
      receipt_email: customer.email,
      description: `Payment for order #${orderId}`,
      shipping: customer.shippingAddress ? {
        name: `${customer.shippingAddress.firstName} ${customer.shippingAddress.lastName}`,
        address: {
          line1: customer.shippingAddress.address1,
          line2: customer.shippingAddress.address2 || '',
          city: customer.shippingAddress.city,
          state: customer.shippingAddress.state,
          postal_code: customer.shippingAddress.postalCode,
          country: customer.shippingAddress.country,
        },
        phone: customer.shippingAddress.phone,
      } : undefined
    });
    
    logger.info(`Payment intent created for order ${orderId}`, { 
      paymentIntentId: paymentIntent.id,
      amount,
      currency
    });
    
    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    };
  } catch (error) {
    logger.error('Error creating payment intent', { 
      error: error.message,
      orderData
    });
    throw error;
  }
};

/**
 * Retrieves a payment intent by ID
 * @param {string} paymentIntentId - The Stripe payment intent ID
 * @returns {Promise<Object>} Stripe payment intent object
 */
exports.retrievePaymentIntent = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    logger.error('Error retrieving payment intent', { 
      error: error.message,
      paymentIntentId
    });
    throw error;
  }
};

/**
 * Cancels a payment intent
 * @param {string} paymentIntentId - The Stripe payment intent ID
 * @returns {Promise<Object>} Canceled payment intent
 */
exports.cancelPaymentIntent = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);
    logger.info(`Payment intent ${paymentIntentId} canceled`);
    return paymentIntent;
  } catch (error) {
    logger.error('Error canceling payment intent', { 
      error: error.message,
      paymentIntentId
    });
    throw error;
  }
};

/**
 * Processes a Stripe webhook event
 * @param {string} payload - Raw request body
 * @param {string} signature - Stripe signature from headers
 * @returns {Object} Processed event
 */
exports.handleWebhookEvent = async (payload, signature) => {
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    logger.info(`Received Stripe webhook event: ${event.type}`);
    
    // Here we would handle the various event types
    // Most importantly, payment_intent.succeeded
    // This would trigger order processing
    
    return event;
  } catch (error) {
    logger.error('Error handling Stripe webhook', { 
      error: error.message
    });
    throw error;
  }
};

/**
 * Creates a refund for a payment
 * @param {string} paymentIntentId - The payment intent ID to refund
 * @param {Object} options - Refund options
 * @param {number} options.amount - Amount to refund (in cents)
 * @param {string} options.reason - Reason for refund ('requested_by_customer', 'duplicate', 'fraudulent')
 * @returns {Promise<Object>} Refund object
 */
exports.createRefund = async (paymentIntentId, options = {}) => {
  try {
    const { amount, reason = 'requested_by_customer' } = options;
    
    const refundParams = {
      payment_intent: paymentIntentId,
      reason
    };
    
    // If amount is provided, add it to refund a specific amount
    if (amount) {
      refundParams.amount = Math.round(amount * 100); // Convert to cents
    }
    
    const refund = await stripe.refunds.create(refundParams);
    
    logger.info(`Refund created for payment intent ${paymentIntentId}`, {
      refundId: refund.id,
      amount: refund.amount / 100, // Convert back to dollars
      status: refund.status
    });
    
    return refund;
  } catch (error) {
    logger.error('Error creating refund', { 
      error: error.message,
      paymentIntentId
    });
    throw error;
  }
};

/**
 * Create a new customer in Stripe
 * @param {Object} customerData - Customer information
 * @returns {Promise<Object>} Stripe customer object
 */
exports.createCustomer = async (customerData) => {
  try {
    const { email, name, phone, metadata = {} } = customerData;
    
    const customer = await stripe.customers.create({
      email,
      name,
      phone,
      metadata
    });
    
    logger.info(`Stripe customer created: ${customer.id}`, { email });
    
    return customer;
  } catch (error) {
    logger.error('Error creating customer in Stripe', { 
      error: error.message,
      customerData
    });
    throw error;
  }
};