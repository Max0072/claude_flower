const paymentService = require('./payment');
const deliveryService = require('./delivery');
const notificationService = require('./notifications');

// Export all integration services
module.exports = {
  payment: paymentService,
  delivery: deliveryService,
  notifications: notificationService
};