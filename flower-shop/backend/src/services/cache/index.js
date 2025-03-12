const redisCache = require('./redis');
const mongooseCache = require('./mongoose-cache');
const logger = require('../../utils/logger');

/**
 * Initialize all caching services
 * @returns {Promise<boolean>} Success status
 */
exports.initialize = async () => {
  try {
    // Initialize Redis connection
    await redisCache.initialize();
    
    // Initialize Mongoose cache middleware
    mongooseCache.initialize();
    
    logger.info('Cache services initialized');
    return true;
  } catch (error) {
    logger.error('Error initializing cache services', {
      error: error.message
    });
    return false;
  }
};

// Export Redis methods
exports.get = redisCache.get;
exports.set = redisCache.set;
exports.del = redisCache.del;
exports.delByPattern = redisCache.delByPattern;
exports.exists = redisCache.exists;
exports.increment = redisCache.increment;
exports.flushAll = redisCache.flushAll;
exports.getStats = redisCache.getStats;

// Export Mongoose cache methods
exports.clearModelCache = mongooseCache.clearCache;
exports.clearCacheMiddleware = mongooseCache.clearCacheMiddleware;

/**
 * Cache API response
 * @param {number} ttl - Cache TTL in seconds
 * @returns {Function} Express middleware
 */
exports.cacheAPIResponse = (ttl = 3600) => {
  return async (req, res, next) => {
    // Skip caching if the request method is not GET
    if (req.method !== 'GET') {
      return next();
    }
    
    try {
      // Generate cache key from request URL
      const key = `api:${req.originalUrl || req.url}`;
      
      // Try to get response from cache
      const cachedResponse = await redisCache.get(key);
      
      if (cachedResponse) {
        // Send cached response
        logger.debug('API cache hit', { key });
        return res.status(cachedResponse.status).json(cachedResponse.data);
      }
      
      // Cache miss, save original res.json method
      const originalJson = res.json;
      
      // Override res.json method to cache the response
      res.json = function(data) {
        // Restore original method
        res.json = originalJson;
        
        // Cache the response
        redisCache.set(key, {
          status: res.statusCode,
          data
        }, ttl).catch(err => {
          logger.error('Failed to cache API response', {
            error: err.message,
            key
          });
        });
        
        // Call original json method
        return originalJson.call(this, data);
      };
      
      next();
    } catch (error) {
      logger.error('Error in API cache middleware', {
        error: error.message,
        url: req.originalUrl || req.url
      });
      next();
    }
  };
};