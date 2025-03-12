const mongoose = require('mongoose');
const redisCache = require('./redis');
const logger = require('../../utils/logger');

// Original mongoose exec function reference
const exec = mongoose.Query.prototype.exec;

/**
 * Initialize mongoose cache middleware
 */
exports.initialize = () => {
  if (mongoose.Query.prototype.cache) {
    logger.info('Mongoose cache already initialized');
    return;
  }
  
  // Add cache method to mongoose Query prototype
  mongoose.Query.prototype.cache = function(options = { ttl: 3600 }) {
    this._cache = true;
    this._cacheTTL = options.ttl || 3600; // Default TTL: 1 hour
    this._cacheKey = options.key || '';
    return this;
  };

  // Override the exec method
  mongoose.Query.prototype.exec = async function() {
    // If caching is not enabled for this query, run the original exec
    if (!this._cache) {
      return exec.apply(this, arguments);
    }
    
    try {
      const key = generateCacheKey(this);
      
      // Attempt to get from cache first
      const cachedResult = await redisCache.get(key);
      
      if (cachedResult) {
        logger.debug('Cache hit', { key });
        
        // Hydrate the document(s) from cache
        const hydratedResult = Array.isArray(cachedResult)
          ? cachedResult.map(doc => new this.model(doc))
          : new this.model(cachedResult);
          
        return hydratedResult;
      }
      
      // Cache miss - execute the query
      logger.debug('Cache miss', { key });
      const result = await exec.apply(this, arguments);
      
      // Cache the result
      if (result) {
        const serializedResult = Array.isArray(result)
          ? result.map(doc => doc.toObject())
          : result.toObject();
          
        await redisCache.set(key, serializedResult, this._cacheTTL);
      }
      
      return result;
    } catch (error) {
      logger.error('Error in mongoose cache middleware', {
        error: error.message,
        model: this.model.modelName,
        query: this.getQuery()
      });
      
      // Fall back to original execution if caching fails
      return exec.apply(this, arguments);
    }
  };
  
  logger.info('Mongoose cache middleware initialized');
};

/**
 * Generate a cache key for a query
 * @param {Object} query - Mongoose query object
 * @returns {string} Cache key
 */
function generateCacheKey(query) {
  const modelName = query.model.modelName;
  const queryObj = query.getQuery();
  const selectObj = query.getOptions();
  const key = query._cacheKey ? 
    `${modelName}:${query._cacheKey}` : 
    `${modelName}:${JSON.stringify(queryObj)}:${JSON.stringify(selectObj)}`;
    
  return key;
}

/**
 * Clear cache for a specific model or key
 * @param {string} modelName - Name of the model to clear cache for
 * @param {string} [key] - Specific key to clear (optional)
 * @returns {Promise<boolean>} Success status
 */
exports.clearCache = async (modelName, key) => {
  try {
    const pattern = key ? 
      `${modelName}:${key}*` : 
      `${modelName}:*`;
      
    const result = await redisCache.delByPattern(pattern);
    
    if (result) {
      logger.info(`Cache cleared for ${pattern}`);
    }
    
    return result;
  } catch (error) {
    logger.error('Error clearing mongoose cache', {
      error: error.message,
      modelName,
      key
    });
    return false;
  }
};

/**
 * Middleware to clear cache after model changes
 * @param {string} modelName - Name of the model
 * @returns {Function} Express middleware
 */
exports.clearCacheMiddleware = (modelName) => {
  return async (req, res, next) => {
    // Continue with the request
    next();
    
    // After response is sent, clear the cache
    try {
      await exports.clearCache(modelName);
    } catch (error) {
      logger.error('Error in clear cache middleware', {
        error: error.message,
        modelName
      });
    }
  };
};