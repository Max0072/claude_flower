const Redis = require('ioredis');
const logger = require('../../utils/logger');

// Redis configuration
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const REDIS_TTL = process.env.REDIS_TTL || 3600; // Default TTL: 1 hour in seconds

// Create Redis client
let redisClient;

/**
 * Initialize Redis connection
 * @returns {Promise<void>}
 */
exports.initialize = async () => {
  try {
    redisClient = new Redis(REDIS_URL);
    
    redisClient.on('error', (err) => {
      logger.error('Redis error', { error: err.message });
    });
    
    redisClient.on('connect', () => {
      logger.info('Connected to Redis server');
    });
    
    // Test connection
    await redisClient.ping();
    
    logger.info('Redis initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize Redis', { error: error.message });
    // Fail gracefully - application can still work without cache
  }
};

/**
 * Get data from cache
 * @param {string} key - Cache key
 * @returns {Promise<any>} Cached data (null if not found)
 */
exports.get = async (key) => {
  try {
    if (!redisClient) {
      return null;
    }
    
    const data = await redisClient.get(key);
    
    if (!data) {
      return null;
    }
    
    return JSON.parse(data);
  } catch (error) {
    logger.error('Error getting data from cache', {
      error: error.message,
      key
    });
    return null;
  }
};

/**
 * Set data in cache with TTL
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 * @param {number} ttl - Time to live in seconds (defaults to REDIS_TTL)
 * @returns {Promise<boolean>} Success status
 */
exports.set = async (key, data, ttl = REDIS_TTL) => {
  try {
    if (!redisClient) {
      return false;
    }
    
    const serializedData = JSON.stringify(data);
    await redisClient.set(key, serializedData, 'EX', ttl);
    
    return true;
  } catch (error) {
    logger.error('Error setting data in cache', {
      error: error.message,
      key
    });
    return false;
  }
};

/**
 * Delete data from cache
 * @param {string} key - Cache key
 * @returns {Promise<boolean>} Success status
 */
exports.del = async (key) => {
  try {
    if (!redisClient) {
      return false;
    }
    
    await redisClient.del(key);
    return true;
  } catch (error) {
    logger.error('Error deleting data from cache', {
      error: error.message,
      key
    });
    return false;
  }
};

/**
 * Delete multiple keys matching a pattern
 * @param {string} pattern - Key pattern to match (e.g., "product:*")
 * @returns {Promise<boolean>} Success status
 */
exports.delByPattern = async (pattern) => {
  try {
    if (!redisClient) {
      return false;
    }
    
    // Get all keys matching the pattern
    const keys = await redisClient.keys(pattern);
    
    if (keys.length > 0) {
      // Delete all matched keys
      await redisClient.del(...keys);
      logger.info(`Deleted ${keys.length} keys matching pattern: ${pattern}`);
    }
    
    return true;
  } catch (error) {
    logger.error('Error deleting data from cache by pattern', {
      error: error.message,
      pattern
    });
    return false;
  }
};

/**
 * Check if key exists in cache
 * @param {string} key - Cache key
 * @returns {Promise<boolean>} Whether key exists
 */
exports.exists = async (key) => {
  try {
    if (!redisClient) {
      return false;
    }
    
    const exists = await redisClient.exists(key);
    return exists === 1;
  } catch (error) {
    logger.error('Error checking if key exists in cache', {
      error: error.message,
      key
    });
    return false;
  }
};

/**
 * Increment a counter in cache
 * @param {string} key - Cache key
 * @param {number} increment - Increment value (default: 1)
 * @param {number} ttl - Time to live in seconds (defaults to REDIS_TTL)
 * @returns {Promise<number>} New value
 */
exports.increment = async (key, increment = 1, ttl = REDIS_TTL) => {
  try {
    if (!redisClient) {
      return 0;
    }
    
    const newValue = await redisClient.incrby(key, increment);
    
    // Set expiry if not already set
    const ttlRemaining = await redisClient.ttl(key);
    if (ttlRemaining === -1) {
      await redisClient.expire(key, ttl);
    }
    
    return newValue;
  } catch (error) {
    logger.error('Error incrementing counter in cache', {
      error: error.message,
      key
    });
    return 0;
  }
};

/**
 * Clear the entire cache
 * @returns {Promise<boolean>} Success status
 */
exports.flushAll = async () => {
  try {
    if (!redisClient) {
      return false;
    }
    
    await redisClient.flushall();
    logger.info('Cache flushed');
    
    return true;
  } catch (error) {
    logger.error('Error flushing cache', {
      error: error.message
    });
    return false;
  }
};

/**
 * Get Redis client stats
 * @returns {Promise<Object>} Redis stats
 */
exports.getStats = async () => {
  try {
    if (!redisClient) {
      return { connected: false };
    }
    
    const info = await redisClient.info();
    
    // Parse INFO command output
    const stats = {};
    const sections = info.split('#');
    
    for (const section of sections) {
      const lines = section.split('\r\n');
      for (const line of lines) {
        if (line.includes(':')) {
          const [key, value] = line.split(':');
          stats[key.trim()] = value;
        }
      }
    }
    
    return {
      connected: true,
      ...stats
    };
  } catch (error) {
    logger.error('Error getting Redis stats', {
      error: error.message
    });
    return { connected: false, error: error.message };
  }
};