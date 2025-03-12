const axios = require('axios');
const logger = require('../../utils/logger');

// SMS configuration
const SMS_API_URL = process.env.SMS_API_URL || 'https://api.sms-provider.example.com';
const SMS_API_KEY = process.env.SMS_API_KEY;
const SMS_SENDER_ID = process.env.SMS_SENDER_ID || 'FloraShop';

/**
 * Send SMS message
 * @param {Object} smsData - SMS information
 * @param {string} smsData.to - Recipient phone number
 * @param {string} smsData.message - SMS message content
 * @returns {Promise<Object>} Send result
 */
exports.sendSMS = async (smsData) => {
  try {
    const { to, message } = smsData;
    
    logger.info(`Sending SMS to ${to}`);
    
    // In a real implementation, this would call the SMS provider API
    // For now, we'll return mock data
    
    // Mock successful SMS send
    const messageId = `sms_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    logger.info('SMS sent successfully', {
      messageId,
      to
    });
    
    return {
      success: true,
      messageId
    };
  } catch (error) {
    logger.error('Error sending SMS', {
      error: error.message,
      to: smsData.to
    });
    throw error;
  }
};

/**
 * Send order confirmation SMS
 * @param {Object} orderData - Order information
 * @returns {Promise<Object>} Send result
 */
exports.sendOrderConfirmationSMS = async (orderData) => {
  try {
    const { user, order } = orderData;
    
    // Skip if no phone number
    if (!user.phone) {
      logger.warn('No phone number available for SMS notification', {
        userId: user.id,
        orderId: order.id
      });
      return { success: false, reason: 'No phone number available' };
    }
    
    const message = `Thank you for your order #${order.invoiceNumber} from Flora Shop! Your order is confirmed and being processed. Total: $${order.total.toFixed(2)}. Track your order at: ${process.env.FRONTEND_URL}/orders/${order.id}`;
    
    return await exports.sendSMS({
      to: user.phone,
      message
    });
  } catch (error) {
    logger.error('Error sending order confirmation SMS', {
      error: error.message,
      orderNumber: orderData.order.invoiceNumber,
      phone: orderData.user.phone
    });
    throw error;
  }
};

/**
 * Send shipping confirmation SMS
 * @param {Object} shipmentData - Shipment information
 * @returns {Promise<Object>} Send result
 */
exports.sendShippingConfirmationSMS = async (shipmentData) => {
  try {
    const { user, order, tracking } = shipmentData;
    
    // Skip if no phone number
    if (!user.phone) {
      logger.warn('No phone number available for SMS notification', {
        userId: user.id,
        orderId: order.id
      });
      return { success: false, reason: 'No phone number available' };
    }
    
    const message = `Flora Shop: Your order #${order.invoiceNumber} has shipped! Track with ${tracking.carrier}: ${tracking.trackingNumber}. Est. delivery: ${new Date(tracking.estimatedDelivery).toLocaleDateString()}`;
    
    return await exports.sendSMS({
      to: user.phone,
      message
    });
  } catch (error) {
    logger.error('Error sending shipping confirmation SMS', {
      error: error.message,
      orderNumber: shipmentData.order.invoiceNumber,
      phone: shipmentData.user.phone
    });
    throw error;
  }
};

/**
 * Send delivery confirmation SMS
 * @param {Object} deliveryData - Delivery information
 * @returns {Promise<Object>} Send result
 */
exports.sendDeliveryConfirmationSMS = async (deliveryData) => {
  try {
    const { user, order } = deliveryData;
    
    // Skip if no phone number
    if (!user.phone) {
      logger.warn('No phone number available for SMS notification', {
        userId: user.id,
        orderId: order.id
      });
      return { success: false, reason: 'No phone number available' };
    }
    
    const message = `Flora Shop: Your order #${order.invoiceNumber} has been delivered! Thank you for shopping with us. Questions? Contact support@florashop.example.com`;
    
    return await exports.sendSMS({
      to: user.phone,
      message
    });
  } catch (error) {
    logger.error('Error sending delivery confirmation SMS', {
      error: error.message,
      orderNumber: deliveryData.order.invoiceNumber,
      phone: deliveryData.user.phone
    });
    throw error;
  }
};

/**
 * Send order status update SMS
 * @param {Object} statusData - Status update information
 * @returns {Promise<Object>} Send result
 */
exports.sendOrderStatusUpdateSMS = async (statusData) => {
  try {
    const { user, order, status } = statusData;
    
    // Skip if no phone number
    if (!user.phone) {
      logger.warn('No phone number available for SMS notification', {
        userId: user.id,
        orderId: order.id
      });
      return { success: false, reason: 'No phone number available' };
    }
    
    let statusMessage;
    
    switch (status) {
      case 'processing':
        statusMessage = 'is now being processed';
        break;
      case 'cancelled':
        statusMessage = 'has been cancelled';
        break;
      case 'refunded':
        statusMessage = 'has been refunded';
        break;
      default:
        statusMessage = `status is now: ${status}`;
    }
    
    const message = `Flora Shop: Your order #${order.invoiceNumber} ${statusMessage}. View details at: ${process.env.FRONTEND_URL}/orders/${order.id}`;
    
    return await exports.sendSMS({
      to: user.phone,
      message
    });
  } catch (error) {
    logger.error('Error sending order status SMS', {
      error: error.message,
      orderNumber: statusData.order.invoiceNumber,
      status: statusData.status,
      phone: statusData.user.phone
    });
    throw error;
  }
};