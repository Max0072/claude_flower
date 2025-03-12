const jwt = require('jsonwebtoken');

/**
 * Generate a JSON Web Token for user authentication
 * @param {String} id - User ID
 * @param {String} role - User role
 * @returns {String} JWT token
 */
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

module.exports = generateToken;