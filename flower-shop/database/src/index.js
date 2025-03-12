const connectDB = require('./config');
const models = require('./models');

module.exports = {
  connectDB,
  ...models
};