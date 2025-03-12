const nodemailer = require('nodemailer');
const logger = require('../../utils/logger');

// Email configuration
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.example.com';
const EMAIL_PORT = process.env.EMAIL_PORT || 587;
const EMAIL_USER = process.env.EMAIL_USER || 'noreply@flora-shop.example.com';
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const EMAIL_FROM = process.env.EMAIL_FROM || 'Flora Shop <noreply@flora-shop.example.com>';

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_PORT === 465, // true for 465, false for other ports
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD
    }
  });
};

/**
 * Send an email
 * @param {Object} emailData - Email information
 * @param {string} emailData.to - Recipient email address
 * @param {string} emailData.subject - Email subject
 * @param {string} emailData.text - Plain text email body
 * @param {string} emailData.html - HTML email body
 * @param {Array} [emailData.attachments] - Email attachments
 * @returns {Promise<Object>} Send result
 */
exports.sendEmail = async (emailData) => {
  try {
    const { to, subject, text, html, attachments = [] } = emailData;
    
    logger.info(`Sending email to ${to}`, { subject });
    
    // Create transporter
    const transporter = createTransporter();
    
    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to,
      subject,
      text,
      html,
      attachments
    });
    
    logger.info('Email sent successfully', {
      messageId: info.messageId,
      to
    });
    
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    logger.error('Error sending email', {
      error: error.message,
      to: emailData.to,
      subject: emailData.subject
    });
    throw error;
  }
};

/**
 * Send welcome email to new user
 * @param {Object} userData - User information
 * @returns {Promise<Object>} Send result
 */
exports.sendWelcomeEmail = async (userData) => {
  try {
    const { email, firstName } = userData;
    
    const subject = 'Welcome to Flora Shop! 🌹';
    
    const text = `
      Hello ${firstName},
      
      Welcome to Flora Shop! We're thrilled to have you join our community of flower enthusiasts.
      
      With your new account, you can:
      - Shop our beautiful collection of flowers and bouquets
      - Save your favorite items to your wishlist
      - Track your orders and delivery status
      - Access exclusive promotions and discounts
      
      If you have any questions or need assistance, please don't hesitate to contact our customer service team at support@florashop.example.com.
      
      Happy shopping!
      
      The Flora Shop Team
    `;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #e91e63;">Welcome to Flora Shop! 🌹</h1>
        <p>Hello ${firstName},</p>
        <p>Welcome to Flora Shop! We're thrilled to have you join our community of flower enthusiasts.</p>
        
        <p>With your new account, you can:</p>
        <ul>
          <li>Shop our beautiful collection of flowers and bouquets</li>
          <li>Save your favorite items to your wishlist</li>
          <li>Track your orders and delivery status</li>
          <li>Access exclusive promotions and discounts</li>
        </ul>
        
        <p>If you have any questions or need assistance, please don't hesitate to contact our customer service team at <a href="mailto:support@florashop.example.com">support@florashop.example.com</a>.</p>
        
        <p>Happy shopping!</p>
        
        <p>The Flora Shop Team</p>
      </div>
    `;
    
    return await exports.sendEmail({
      to: email,
      subject,
      text,
      html
    });
  } catch (error) {
    logger.error('Error sending welcome email', {
      error: error.message,
      email: userData.email
    });
    throw error;
  }
};

/**
 * Send order confirmation email
 * @param {Object} orderData - Order information
 * @returns {Promise<Object>} Send result
 */
exports.sendOrderConfirmationEmail = async (orderData) => {
  try {
    const { user, order, items } = orderData;
    
    const subject = `Order Confirmation #${order.invoiceNumber}`;
    
    // Generate items HTML
    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <img src="${item.image}" alt="${item.name}" width="50" height="50" style="border-radius: 5px;" />
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">$${item.price.toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #e91e63;">Your Order Has Been Confirmed</h1>
        <p>Hello ${user.firstName},</p>
        <p>Thank you for your order! We're delighted to confirm that we've received your order and it's being processed.</p>
        
        <h2>Order Details</h2>
        <p>Order Number: <strong>${order.invoiceNumber}</strong></p>
        <p>Order Date: <strong>${new Date(order.createdAt).toLocaleDateString()}</strong></p>
        
        <h3>Items</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f9f9f9;">
              <th style="padding: 10px; text-align: left;">Image</th>
              <th style="padding: 10px; text-align: left;">Product</th>
              <th style="padding: 10px; text-align: left;">Quantity</th>
              <th style="padding: 10px; text-align: left;">Price</th>
              <th style="padding: 10px; text-align: left;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <h3>Order Summary</h3>
        <table style="width: 100%; margin-top: 20px;">
          <tr>
            <td style="padding: 5px 0;">Subtotal:</td>
            <td style="padding: 5px 0; text-align: right;">$${order.subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0;">Shipping:</td>
            <td style="padding: 5px 0; text-align: right;">$${order.delivery.price.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0;">Tax:</td>
            <td style="padding: 5px 0; text-align: right;">$${order.tax.toFixed(2)}</td>
          </tr>
          <tr style="font-weight: bold; font-size: 1.1em;">
            <td style="padding: 10px 0; border-top: 2px solid #eee;">Total:</td>
            <td style="padding: 10px 0; text-align: right; border-top: 2px solid #eee;">$${order.total.toFixed(2)}</td>
          </tr>
        </table>
        
        <h3>Shipping Information</h3>
        <p>
          ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br />
          ${order.shippingAddress.address1}<br />
          ${order.shippingAddress.address2 ? order.shippingAddress.address2 + '<br />' : ''}
          ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}<br />
          ${order.shippingAddress.country}
        </p>
        
        <h3>Shipping Method</h3>
        <p>${order.delivery.method === 'standard' ? 'Standard Shipping' : order.delivery.method === 'express' ? 'Express Shipping' : 'Same Day Delivery'}</p>
        
        <h3>Payment Method</h3>
        <p>${order.payment.method === 'credit_card' ? 'Credit Card' : order.payment.method === 'paypal' ? 'PayPal' : 'Bank Transfer'}</p>
        
        <p>You can track your order status in your <a href="${process.env.FRONTEND_URL}/account/orders">account dashboard</a>.</p>
        
        <p>Thank you for shopping with Flora Shop!</p>
        
        <p>Best regards,<br />The Flora Shop Team</p>
      </div>
    `;
    
    const text = `
      Your Order Has Been Confirmed
      
      Hello ${user.firstName},
      
      Thank you for your order! We're delighted to confirm that we've received your order and it's being processed.
      
      Order Details
      Order Number: ${order.invoiceNumber}
      Order Date: ${new Date(order.createdAt).toLocaleDateString()}
      
      Items:
      ${items.map(item => `- ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`).join('\n')}
      
      Order Summary:
      Subtotal: $${order.subtotal.toFixed(2)}
      Shipping: $${order.delivery.price.toFixed(2)}
      Tax: $${order.tax.toFixed(2)}
      Total: $${order.total.toFixed(2)}
      
      Shipping Information:
      ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}
      ${order.shippingAddress.address1}
      ${order.shippingAddress.address2 ? order.shippingAddress.address2 + '\n' : ''}
      ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}
      ${order.shippingAddress.country}
      
      Shipping Method:
      ${order.delivery.method === 'standard' ? 'Standard Shipping' : order.delivery.method === 'express' ? 'Express Shipping' : 'Same Day Delivery'}
      
      Payment Method:
      ${order.payment.method === 'credit_card' ? 'Credit Card' : order.payment.method === 'paypal' ? 'PayPal' : 'Bank Transfer'}
      
      You can track your order status in your account dashboard at ${process.env.FRONTEND_URL}/account/orders
      
      Thank you for shopping with Flora Shop!
      
      Best regards,
      The Flora Shop Team
    `;
    
    return await exports.sendEmail({
      to: user.email,
      subject,
      text,
      html
    });
  } catch (error) {
    logger.error('Error sending order confirmation email', {
      error: error.message,
      orderNumber: orderData.order.invoiceNumber,
      email: orderData.user.email
    });
    throw error;
  }
};

/**
 * Send shipping confirmation email
 * @param {Object} shipmentData - Shipment information
 * @returns {Promise<Object>} Send result
 */
exports.sendShippingConfirmationEmail = async (shipmentData) => {
  try {
    const { user, order, tracking } = shipmentData;
    
    const subject = `Your Order Has Shipped - #${order.invoiceNumber}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #e91e63;">Your Order Has Shipped!</h1>
        <p>Hello ${user.firstName},</p>
        <p>Great news! Your order #${order.invoiceNumber} has been shipped and is on its way to you.</p>
        
        <h2>Tracking Information</h2>
        <p>
          <strong>Carrier:</strong> ${tracking.carrier}<br />
          <strong>Tracking Number:</strong> ${tracking.trackingNumber}<br />
          <strong>Estimated Delivery:</strong> ${new Date(tracking.estimatedDelivery).toLocaleDateString()}<br />
        </p>
        
        <p><a href="${tracking.tracking_url}" style="background-color: #e91e63; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block;">Track Your Package</a></p>
        
        <h3>Order Summary</h3>
        <p>
          <strong>Order Number:</strong> ${order.invoiceNumber}<br />
          <strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}<br />
          <strong>Total:</strong> $${order.total.toFixed(2)}
        </p>
        
        <h3>Shipping Address</h3>
        <p>
          ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br />
          ${order.shippingAddress.address1}<br />
          ${order.shippingAddress.address2 ? order.shippingAddress.address2 + '<br />' : ''}
          ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}<br />
          ${order.shippingAddress.country}
        </p>
        
        <p>You can view the complete details of your order in your <a href="${process.env.FRONTEND_URL}/account/orders/${order.id}">account dashboard</a>.</p>
        
        <p>If you have any questions about your delivery, please contact our customer service team at <a href="mailto:support@florashop.example.com">support@florashop.example.com</a>.</p>
        
        <p>Thank you for shopping with Flora Shop!</p>
        
        <p>Best regards,<br />The Flora Shop Team</p>
      </div>
    `;
    
    const text = `
      Your Order Has Shipped!
      
      Hello ${user.firstName},
      
      Great news! Your order #${order.invoiceNumber} has been shipped and is on its way to you.
      
      Tracking Information:
      Carrier: ${tracking.carrier}
      Tracking Number: ${tracking.trackingNumber}
      Estimated Delivery: ${new Date(tracking.estimatedDelivery).toLocaleDateString()}
      
      Track your package at: ${tracking.tracking_url}
      
      Order Summary:
      Order Number: ${order.invoiceNumber}
      Order Date: ${new Date(order.createdAt).toLocaleDateString()}
      Total: $${order.total.toFixed(2)}
      
      Shipping Address:
      ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}
      ${order.shippingAddress.address1}
      ${order.shippingAddress.address2 ? order.shippingAddress.address2 + '\n' : ''}
      ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}
      ${order.shippingAddress.country}
      
      You can view the complete details of your order in your account dashboard.
      
      If you have any questions about your delivery, please contact our customer service team at support@florashop.example.com.
      
      Thank you for shopping with Flora Shop!
      
      Best regards,
      The Flora Shop Team
    `;
    
    return await exports.sendEmail({
      to: user.email,
      subject,
      text,
      html
    });
  } catch (error) {
    logger.error('Error sending shipping confirmation email', {
      error: error.message,
      orderNumber: shipmentData.order.invoiceNumber,
      email: shipmentData.user.email
    });
    throw error;
  }
};

/**
 * Send password reset email
 * @param {Object} userData - User information
 * @param {string} resetToken - Password reset token
 * @returns {Promise<Object>} Send result
 */
exports.sendPasswordResetEmail = async (userData, resetToken) => {
  try {
    const { email, firstName } = userData;
    
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const subject = 'Reset Your Flora Shop Password';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #e91e63;">Reset Your Password</h1>
        <p>Hello ${firstName},</p>
        <p>We received a request to reset your password for your Flora Shop account. If you didn't make this request, you can safely ignore this email.</p>
        
        <p>To reset your password, click the button below:</p>
        
        <p><a href="${resetUrl}" style="background-color: #e91e63; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a></p>
        
        <p>Or copy and paste this link into your browser:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        
        <p>This link will expire in 1 hour for security reasons.</p>
        
        <p>If you need any assistance, please contact our customer service team at <a href="mailto:support@florashop.example.com">support@florashop.example.com</a>.</p>
        
        <p>Best regards,<br />The Flora Shop Team</p>
      </div>
    `;
    
    const text = `
      Reset Your Password
      
      Hello ${firstName},
      
      We received a request to reset your password for your Flora Shop account. If you didn't make this request, you can safely ignore this email.
      
      To reset your password, click the link below:
      ${resetUrl}
      
      This link will expire in 1 hour for security reasons.
      
      If you need any assistance, please contact our customer service team at support@florashop.example.com.
      
      Best regards,
      The Flora Shop Team
    `;
    
    return await exports.sendEmail({
      to: email,
      subject,
      text,
      html
    });
  } catch (error) {
    logger.error('Error sending password reset email', {
      error: error.message,
      email: userData.email
    });
    throw error;
  }
};