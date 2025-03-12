const emailService = require('./email');
const smsService = require('./sms');
const logger = require('../../utils/logger');

/**
 * Send user welcome notifications
 * @param {Object} userData - User information
 * @returns {Promise<Object>} Notification results
 */
exports.sendUserWelcomeNotifications = async (userData) => {
  try {
    logger.info(`Sending welcome notifications to user ${userData.email}`);
    
    const results = {
      email: null,
      sms: null
    };
    
    // Send welcome email
    results.email = await emailService.sendWelcomeEmail(userData);
    
    // No SMS for welcome (usually just email)
    
    return {
      success: true,
      results
    };
  } catch (error) {
    logger.error('Error sending welcome notifications', {
      error: error.message,
      email: userData.email
    });
    throw error;
  }
};

/**
 * Send order confirmation notifications
 * @param {Object} orderData - Order information
 * @returns {Promise<Object>} Notification results
 */
exports.sendOrderConfirmationNotifications = async (orderData) => {
  try {
    logger.info(`Sending order confirmation notifications for order ${orderData.order.id}`);
    
    const results = {
      email: null,
      sms: null
    };
    
    // Send notifications in parallel for better performance
    const [emailResult, smsResult] = await Promise.allSettled([
      emailService.sendOrderConfirmationEmail(orderData),
      // Only send SMS if user has opted in for SMS notifications
      orderData.user.preferences?.smsNotifications ? 
        smsService.sendOrderConfirmationSMS(orderData) : 
        Promise.resolve({ success: false, reason: 'SMS notifications disabled' })
    ]);
    
    results.email = emailResult.status === 'fulfilled' ? emailResult.value : { success: false, error: emailResult.reason };
    results.sms = smsResult.status === 'fulfilled' ? smsResult.value : { success: false, error: smsResult.reason };
    
    return {
      success: results.email.success, // Consider successful if email was sent
      results
    };
  } catch (error) {
    logger.error('Error sending order confirmation notifications', {
      error: error.message,
      orderId: orderData.order.id
    });
    throw error;
  }
};

/**
 * Send shipping confirmation notifications
 * @param {Object} shipmentData - Shipment information
 * @returns {Promise<Object>} Notification results
 */
exports.sendShippingConfirmationNotifications = async (shipmentData) => {
  try {
    logger.info(`Sending shipping confirmation notifications for order ${shipmentData.order.id}`);
    
    const results = {
      email: null,
      sms: null
    };
    
    // Send notifications in parallel
    const [emailResult, smsResult] = await Promise.allSettled([
      emailService.sendShippingConfirmationEmail(shipmentData),
      // Only send SMS if user has opted in for SMS notifications
      shipmentData.user.preferences?.smsNotifications ? 
        smsService.sendShippingConfirmationSMS(shipmentData) : 
        Promise.resolve({ success: false, reason: 'SMS notifications disabled' })
    ]);
    
    results.email = emailResult.status === 'fulfilled' ? emailResult.value : { success: false, error: emailResult.reason };
    results.sms = smsResult.status === 'fulfilled' ? smsResult.value : { success: false, error: smsResult.reason };
    
    return {
      success: results.email.success, // Consider successful if email was sent
      results
    };
  } catch (error) {
    logger.error('Error sending shipping confirmation notifications', {
      error: error.message,
      orderId: shipmentData.order.id
    });
    throw error;
  }
};

/**
 * Send delivery confirmation notifications
 * @param {Object} deliveryData - Delivery information
 * @returns {Promise<Object>} Notification results
 */
exports.sendDeliveryConfirmationNotifications = async (deliveryData) => {
  try {
    logger.info(`Sending delivery confirmation notifications for order ${deliveryData.order.id}`);
    
    const results = {
      sms: null
    };
    
    // For delivery, we typically only send SMS notification
    // Only send SMS if user has opted in for SMS notifications
    if (deliveryData.user.preferences?.smsNotifications) {
      results.sms = await smsService.sendDeliveryConfirmationSMS(deliveryData);
    } else {
      results.sms = { success: false, reason: 'SMS notifications disabled' };
    }
    
    return {
      success: results.sms.success,
      results
    };
  } catch (error) {
    logger.error('Error sending delivery confirmation notifications', {
      error: error.message,
      orderId: deliveryData.order.id
    });
    throw error;
  }
};

/**
 * Send order status update notifications
 * @param {Object} statusData - Status update information
 * @returns {Promise<Object>} Notification results
 */
exports.sendOrderStatusUpdateNotifications = async (statusData) => {
  try {
    logger.info(`Sending order status update notifications for order ${statusData.order.id}`);
    
    const results = {
      sms: null
    };
    
    // For status updates, we typically only send SMS notification
    // Only send SMS if user has opted in for SMS notifications
    if (statusData.user.preferences?.smsNotifications) {
      results.sms = await smsService.sendOrderStatusUpdateSMS(statusData);
    } else {
      results.sms = { success: false, reason: 'SMS notifications disabled' };
    }
    
    return {
      success: results.sms.success,
      results
    };
  } catch (error) {
    logger.error('Error sending order status update notifications', {
      error: error.message,
      orderId: statusData.order.id,
      status: statusData.status
    });
    throw error;
  }
};

/**
 * Send password reset notification
 * @param {Object} userData - User information
 * @param {string} resetToken - Password reset token
 * @returns {Promise<Object>} Notification results
 */
exports.sendPasswordResetNotification = async (userData, resetToken) => {
  try {
    logger.info(`Sending password reset notification to user ${userData.email}`);
    
    const results = {
      email: null
    };
    
    // Send password reset email
    results.email = await emailService.sendPasswordResetEmail(userData, resetToken);
    
    return {
      success: results.email.success,
      results
    };
  } catch (error) {
    logger.error('Error sending password reset notification', {
      error: error.message,
      email: userData.email
    });
    throw error;
  }
};