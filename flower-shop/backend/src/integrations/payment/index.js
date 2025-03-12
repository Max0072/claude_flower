const stripeService = require('./stripe');
const paypalService = require('./paypal');
const logger = require('../../utils/logger');

/**
 * Process payment using the specified payment method
 * @param {Object} paymentData - Payment data
 * @param {string} paymentData.method - Payment method ('credit_card', 'paypal')
 * @param {Object} paymentData.order - Order information
 * @returns {Promise<Object>} Payment process result
 */
exports.processPayment = async (paymentData) => {
  const { method, order } = paymentData;
  
  try {
    // Validate payment data
    if (!method) {
      throw new Error('Payment method is required');
    }
    
    if (!order || !order.total) {
      throw new Error('Invalid order data');
    }
    
    logger.info(`Processing payment with ${method}`, { 
      orderId: order.id,
      amount: order.total
    });
    
    let result;
    
    // Process payment based on the selected method
    switch (method) {
      case 'credit_card':
        result = await stripeService.createPaymentIntent({
          amount: order.total,
          currency: 'usd',
          orderId: order.id,
          customer: {
            email: order.user.email,
            shippingAddress: order.shippingAddress
          }
        });
        break;
        
      case 'paypal':
        result = await paypalService.createOrder({
          orderId: order.id,
          amount: order.total,
          currency: 'USD',
          returnUrl: `${process.env.FRONTEND_URL}/checkout/success?orderId=${order.id}`,
          cancelUrl: `${process.env.FRONTEND_URL}/checkout/cancel?orderId=${order.id}`
        });
        break;
        
      default:
        throw new Error(`Unsupported payment method: ${method}`);
    }
    
    return {
      success: true,
      paymentMethod: method,
      paymentDetails: result
    };
  } catch (error) {
    logger.error('Payment processing failed', {
      error: error.message,
      method,
      orderId: order?.id
    });
    
    throw error;
  }
};

/**
 * Capture payment after checkout completion
 * @param {Object} captureData - Capture data
 * @param {string} captureData.method - Payment method
 * @param {string} captureData.paymentId - Payment ID
 * @param {string} captureData.orderId - Order ID
 * @returns {Promise<Object>} Capture result
 */
exports.capturePayment = async (captureData) => {
  const { method, paymentId, orderId } = captureData;
  
  try {
    logger.info(`Capturing payment for order ${orderId}`, { 
      method,
      paymentId
    });
    
    let result;
    
    switch (method) {
      case 'paypal':
        result = await paypalService.capturePayment(paymentId);
        break;
        
      case 'credit_card':
        // Stripe captures automatically with payment intent
        result = await stripeService.retrievePaymentIntent(paymentId);
        break;
        
      default:
        throw new Error(`Unsupported payment method for capture: ${method}`);
    }
    
    return {
      success: true,
      paymentMethod: method,
      captureDetails: result
    };
  } catch (error) {
    logger.error('Payment capture failed', {
      error: error.message,
      method,
      paymentId,
      orderId
    });
    
    throw error;
  }
};

/**
 * Process refund for a payment
 * @param {Object} refundData - Refund data
 * @param {string} refundData.method - Payment method
 * @param {string} refundData.paymentId - Payment ID
 * @param {string} refundData.orderId - Order ID
 * @param {number} refundData.amount - Refund amount
 * @param {string} refundData.reason - Refund reason
 * @returns {Promise<Object>} Refund result
 */
exports.processRefund = async (refundData) => {
  const { method, paymentId, orderId, amount, reason } = refundData;
  
  try {
    logger.info(`Processing refund for order ${orderId}`, { 
      method,
      paymentId,
      amount
    });
    
    let result;
    
    switch (method) {
      case 'credit_card':
        result = await stripeService.createRefund(paymentId, {
          amount,
          reason
        });
        break;
        
      case 'paypal':
        result = await paypalService.refundPayment(paymentId, {
          amount,
          note: reason
        });
        break;
        
      default:
        throw new Error(`Unsupported payment method for refund: ${method}`);
    }
    
    return {
      success: true,
      paymentMethod: method,
      refundDetails: result
    };
  } catch (error) {
    logger.error('Refund processing failed', {
      error: error.message,
      method,
      paymentId,
      orderId,
      amount
    });
    
    throw error;
  }
};

/**
 * Handle webhook event from payment provider
 * @param {Object} webhookData - Webhook data
 * @param {string} webhookData.provider - Payment provider ('stripe', 'paypal')
 * @param {Object} webhookData.event - Event data
 * @param {Object} webhookData.headers - Request headers
 * @returns {Promise<Object>} Webhook processing result
 */
exports.handleWebhook = async (webhookData) => {
  const { provider, event, headers } = webhookData;
  
  try {
    logger.info(`Processing webhook from ${provider}`, { 
      eventType: event.type || event.event_type
    });
    
    let result;
    
    switch (provider) {
      case 'stripe':
        result = await stripeService.handleWebhookEvent(event, headers['stripe-signature']);
        break;
        
      case 'paypal':
        // Verify PayPal webhook signature
        const isValid = await paypalService.verifyWebhookSignature(event, headers);
        
        if (!isValid) {
          throw new Error('Invalid PayPal webhook signature');
        }
        
        // Process webhook event based on event type
        result = event;
        break;
        
      default:
        throw new Error(`Unsupported webhook provider: ${provider}`);
    }
    
    return {
      success: true,
      provider,
      result
    };
  } catch (error) {
    logger.error('Webhook processing failed', {
      error: error.message,
      provider
    });
    
    throw error;
  }
};