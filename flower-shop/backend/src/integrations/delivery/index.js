const deliveryService = require('./delivery-service');
const logger = require('../../utils/logger');

/**
 * Calculate shipping rates for an order
 * @param {Object} shippingData - Shipping information
 * @returns {Promise<Object>} Calculated shipping rates
 */
exports.calculateShippingRates = async (shippingData) => {
  try {
    return await deliveryService.calculateShippingRates(shippingData);
  } catch (error) {
    logger.error('Error calculating shipping rates', {
      error: error.message
    });
    throw error;
  }
};

/**
 * Create a delivery for an order
 * @param {Object} orderData - Order information
 * @returns {Promise<Object>} Delivery tracking details
 */
exports.createDelivery = async (orderData) => {
  try {
    const { order, items } = orderData;
    
    // Calculate package weight based on items
    const packageWeight = calculatePackageWeight(items);
    
    const deliveryData = {
      orderId: order.id,
      recipient: {
        name: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
        phone: order.shippingAddress.phone,
        email: order.user.email
      },
      address: {
        line1: order.shippingAddress.address1,
        line2: order.shippingAddress.address2,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        postalCode: order.shippingAddress.postalCode,
        country: order.shippingAddress.country
      },
      package: {
        weight: packageWeight,
        items: items.length
      },
      service: order.delivery.method
    };
    
    return await deliveryService.createDelivery(deliveryData);
  } catch (error) {
    logger.error('Error creating delivery', {
      error: error.message
    });
    throw error;
  }
};

/**
 * Track a delivery
 * @param {string} trackingNumber - Tracking number
 * @returns {Promise<Object>} Tracking information
 */
exports.trackDelivery = async (trackingNumber) => {
  try {
    return await deliveryService.trackDelivery(trackingNumber);
  } catch (error) {
    logger.error('Error tracking delivery', {
      error: error.message,
      trackingNumber
    });
    throw error;
  }
};

/**
 * Cancel a delivery
 * @param {string} deliveryId - Delivery ID
 * @returns {Promise<Object>} Cancellation result
 */
exports.cancelDelivery = async (deliveryId) => {
  try {
    return await deliveryService.cancelDelivery(deliveryId);
  } catch (error) {
    logger.error('Error cancelling delivery', {
      error: error.message,
      deliveryId
    });
    throw error;
  }
};

/**
 * Update delivery address
 * @param {Object} updateData - Update information
 * @returns {Promise<Object>} Update result
 */
exports.updateDeliveryAddress = async (updateData) => {
  try {
    return await deliveryService.updateDeliveryAddress(updateData);
  } catch (error) {
    logger.error('Error updating delivery address', {
      error: error.message
    });
    throw error;
  }
};

/**
 * Calculate package weight based on items
 * @param {Array} items - Order items
 * @returns {number} Total weight in kg
 */
function calculatePackageWeight(items) {
  // For simplicity, we'll assume a base weight plus additional weight per item
  const baseWeight = 0.5; // Base packaging weight in kg
  const weightPerItem = 0.2; // Average weight per item in kg
  
  return baseWeight + (items.length * weightPerItem);
}