const axios = require('axios');
const logger = require('../../utils/logger');

// PayPal API configuration
const PAYPAL_BASE_URL = process.env.PAYPAL_MODE === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

/**
 * Get an access token from PayPal
 * @returns {Promise<string>} Access token
 */
const getAccessToken = async () => {
  try {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
    
    const response = await axios({
      method: 'post',
      url: `${PAYPAL_BASE_URL}/v1/oauth2/token`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${auth}`
      },
      data: 'grant_type=client_credentials'
    });
    
    return response.data.access_token;
  } catch (error) {
    logger.error('Error getting PayPal access token', {
      error: error.response ? error.response.data : error.message
    });
    throw new Error('Failed to authenticate with PayPal');
  }
};

/**
 * Create a PayPal order for checkout
 * @param {Object} orderData - Order information
 * @param {string} orderData.orderId - System order ID
 * @param {number} orderData.amount - Order amount
 * @param {string} orderData.currency - Currency code (default: USD)
 * @param {string} orderData.returnUrl - URL to redirect after approval
 * @param {string} orderData.cancelUrl - URL to redirect after cancellation
 * @returns {Promise<Object>} PayPal order details with links
 */
exports.createOrder = async (orderData) => {
  try {
    const { orderId, amount, currency = 'USD', returnUrl, cancelUrl } = orderData;
    
    // Validate amount
    if (!amount || amount <= 0) {
      throw new Error('Invalid payment amount');
    }
    
    const accessToken = await getAccessToken();
    
    const response = await axios({
      method: 'post',
      url: `${PAYPAL_BASE_URL}/v2/checkout/orders`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      data: {
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: orderId,
          description: `Order #${orderId} from Flora Shop`,
          amount: {
            currency_code: currency,
            value: amount.toFixed(2)
          }
        }],
        application_context: {
          brand_name: 'Flora Shop',
          landing_page: 'BILLING',
          shipping_preference: 'SET_PROVIDED_ADDRESS',
          user_action: 'PAY_NOW',
          return_url: returnUrl,
          cancel_url: cancelUrl
        }
      }
    });
    
    const { id, links, status } = response.data;
    
    logger.info(`PayPal order created: ${id}`, { 
      paypalOrderId: id,
      status,
      systemOrderId: orderId,
      amount
    });
    
    // Find approval URL to redirect the customer
    const approvalLink = links.find(link => link.rel === 'approve');
    
    return {
      id,
      status,
      approvalUrl: approvalLink ? approvalLink.href : null,
      links
    };
  } catch (error) {
    logger.error('Error creating PayPal order', {
      error: error.response ? error.response.data : error.message,
      orderData
    });
    throw error;
  }
};

/**
 * Capture payment for an approved PayPal order
 * @param {string} paypalOrderId - PayPal order ID to capture
 * @returns {Promise<Object>} Capture details
 */
exports.capturePayment = async (paypalOrderId) => {
  try {
    const accessToken = await getAccessToken();
    
    const response = await axios({
      method: 'post',
      url: `${PAYPAL_BASE_URL}/v2/checkout/orders/${paypalOrderId}/capture`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    const { id, status, purchase_units } = response.data;
    
    logger.info(`PayPal payment captured: ${id}`, { 
      paypalOrderId: id,
      status
    });
    
    // Get transaction details from the capture
    const captureDetails = purchase_units[0].payments.captures[0];
    
    return {
      paypalOrderId: id,
      status,
      transactionId: captureDetails.id,
      amount: captureDetails.amount.value,
      currency: captureDetails.amount.currency_code,
      payerEmail: response.data.payer?.email_address,
      paymentStatus: captureDetails.status,
      captureDetails
    };
  } catch (error) {
    logger.error('Error capturing PayPal payment', {
      error: error.response ? error.response.data : error.message,
      paypalOrderId
    });
    throw error;
  }
};

/**
 * Get PayPal order details
 * @param {string} paypalOrderId - PayPal order ID
 * @returns {Promise<Object>} Order details
 */
exports.getOrderDetails = async (paypalOrderId) => {
  try {
    const accessToken = await getAccessToken();
    
    const response = await axios({
      method: 'get',
      url: `${PAYPAL_BASE_URL}/v2/checkout/orders/${paypalOrderId}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    return response.data;
  } catch (error) {
    logger.error('Error getting PayPal order details', {
      error: error.response ? error.response.data : error.message,
      paypalOrderId
    });
    throw error;
  }
};

/**
 * Refund a PayPal payment
 * @param {string} captureId - The PayPal capture ID to refund
 * @param {Object} options - Refund options
 * @param {number} options.amount - Amount to refund
 * @param {string} options.currency - Currency code (default: USD)
 * @param {string} options.note - Note to include with the refund
 * @returns {Promise<Object>} Refund details
 */
exports.refundPayment = async (captureId, options = {}) => {
  try {
    const { amount, currency = 'USD', note = 'Refund for returned item' } = options;
    
    const accessToken = await getAccessToken();
    
    const requestBody = {};
    
    // If amount is specified, include it in the refund
    if (amount) {
      requestBody.amount = {
        value: amount.toFixed(2),
        currency_code: currency
      };
    }
    
    // Add note to refund
    if (note) {
      requestBody.note_to_payer = note;
    }
    
    const response = await axios({
      method: 'post',
      url: `${PAYPAL_BASE_URL}/v2/payments/captures/${captureId}/refund`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      data: requestBody
    });
    
    logger.info(`PayPal refund processed for capture ${captureId}`, {
      refundId: response.data.id,
      status: response.data.status,
      amount: response.data.amount?.value
    });
    
    return response.data;
  } catch (error) {
    logger.error('Error refunding PayPal payment', {
      error: error.response ? error.response.data : error.message,
      captureId
    });
    throw error;
  }
};

/**
 * Verify a PayPal webhook signature
 * @param {Object} webhookData - Webhook data
 * @param {Object} headers - Request headers containing signature
 * @returns {Promise<boolean>} Whether the signature is valid
 */
exports.verifyWebhookSignature = async (webhookData, headers) => {
  try {
    const accessToken = await getAccessToken();
    
    const response = await axios({
      method: 'post',
      url: `${PAYPAL_BASE_URL}/v1/notifications/verify-webhook-signature`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      data: {
        webhook_id: process.env.PAYPAL_WEBHOOK_ID,
        webhook_event: webhookData,
        cert_url: headers['paypal-cert-url'],
        transmission_id: headers['paypal-transmission-id'],
        transmission_time: headers['paypal-transmission-time'],
        transmission_sig: headers['paypal-transmission-sig'],
        auth_algo: headers['paypal-auth-algo']
      }
    });
    
    return response.data.verification_status === 'SUCCESS';
  } catch (error) {
    logger.error('Error verifying PayPal webhook signature', {
      error: error.response ? error.response.data : error.message
    });
    return false;
  }
};