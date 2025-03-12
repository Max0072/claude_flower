# Flora Shop Integrations

This directory contains integrations with external services needed for the Flora online flower shop.

## Payment Integrations

Payment integrations handle online payment processing for customer orders.

### Stripe

The Stripe integration (`payment/stripe.js`) handles credit card payments using Stripe's payment API:

- Creating payment intents
- Processing payments
- Handling refunds
- Managing customer information
- Processing webhooks

### PayPal

The PayPal integration (`payment/paypal.js`) handles PayPal payments:

- Creating PayPal orders
- Capturing payments
- Getting transaction details
- Processing refunds
- Webhook verification

## Delivery Integrations

Delivery integrations handle shipping rate calculations and delivery tracking.

The delivery service (`delivery/delivery-service.js`) supports:

- Calculating shipping rates
- Creating deliveries
- Tracking deliveries
- Canceling deliveries
- Updating delivery addresses

## Notification Integrations

Notification integrations handle communication with customers.

### Email Notifications

The email service (`notifications/email.js`) handles sending emails via SMTP:

- Welcome emails
- Order confirmation emails
- Shipping confirmation emails
- Password reset emails

### SMS Notifications

The SMS service (`notifications/sms.js`) handles sending SMS text messages:

- Order confirmation SMS
- Shipping confirmation SMS
- Delivery confirmation SMS
- Order status update SMS

## Using Integrations

Here are some examples of how to use these integrations:

### Processing a Payment

```javascript
const { payment } = require('../integrations');

// Process a payment
const paymentResult = await payment.processPayment({
  method: 'credit_card', // or 'paypal'
  order: orderDetails
});

// Capture a payment
const captureResult = await payment.capturePayment({
  method: 'paypal',
  paymentId: paymentResult.paymentDetails.id,
  orderId: orderDetails.id
});
```

### Creating a Delivery

```javascript
const { delivery } = require('../integrations');

// Calculate shipping rates
const shippingRates = await delivery.calculateShippingRates({
  address: shippingAddress,
  package: {
    weight: 2.5
  },
  type: 'standard' // or 'express', 'same_day'
});

// Create a delivery
const deliveryResult = await delivery.createDelivery({
  order: orderDetails,
  items: orderItems
});
```

### Sending Notifications

```javascript
const { notifications } = require('../integrations');

// Send order confirmation
await notifications.sendOrderConfirmationNotifications({
  user: userDetails,
  order: orderDetails,
  items: orderItems
});

// Send shipping confirmation
await notifications.sendShippingConfirmationNotifications({
  user: userDetails,
  order: orderDetails,
  tracking: trackingDetails
});
```

## Environment Variables

The following environment variables should be set for integrations to work properly:

### Payment
- `STRIPE_SECRET_KEY`: Your Stripe secret API key
- `STRIPE_WEBHOOK_SECRET`: Secret for verifying Stripe webhooks
- `PAYPAL_MODE`: Set to 'live' or 'sandbox'
- `PAYPAL_CLIENT_ID`: Your PayPal client ID
- `PAYPAL_SECRET`: Your PayPal secret
- `PAYPAL_WEBHOOK_ID`: Your PayPal webhook ID

### Delivery
- `DELIVERY_API_URL`: URL of your delivery service API
- `DELIVERY_API_KEY`: API key for your delivery service

### Notifications
- `EMAIL_HOST`: SMTP server host
- `EMAIL_PORT`: SMTP server port
- `EMAIL_USER`: SMTP username
- `EMAIL_PASSWORD`: SMTP password
- `EMAIL_FROM`: Default sender email
- `SMS_API_URL`: URL of your SMS provider API
- `SMS_API_KEY`: API key for your SMS provider
- `SMS_SENDER_ID`: Sender ID for SMS messages
- `FRONTEND_URL`: URL of your frontend application (used in email links)