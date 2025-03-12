// Setup test environment
process.env.NODE_ENV = 'test';

// Import required modules
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Setup before tests
before(async function() {
  this.timeout(30000); // Increase timeout for MongoDB Memory Server setup

  // Start MongoDB Memory Server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Connect to the in-memory database
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clear database between tests
afterEach(async () => {
  if (mongoose.connection.db) {
    // Get all collections
    const collections = await mongoose.connection.db.collections();
    
    // Drop all collections
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }
});

// Disconnect and close after tests
after(async () => {
  if (mongoose.connection) {
    await mongoose.connection.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});