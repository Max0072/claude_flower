# Flora Shop Backend Services

This directory contains various services that support the Flora online flower shop backend.

## Cache Service

The cache service (`cache/`) provides caching functionality for the application to improve performance.

### Redis Cache

The Redis cache service (`cache/redis.js`) provides functions for interacting with a Redis server:

- Storing data with TTL (Time To Live)
- Retrieving cached data
- Deleting cached data
- Checking if a key exists
- Incrementing counters
- Clearing the cache

### Mongoose Cache

The Mongoose cache service (`cache/mongoose-cache.js`) extends Mongoose queries with caching capabilities:

- Cache query results in Redis
- Clear cache for specific models
- Clear cache based on key patterns
- Express middleware for clearing cache after model changes

Example of using Mongoose cache:

```javascript
// Enable caching for this query
const products = await Product.find({ category: 'bouquets' })
  .cache({
    ttl: 3600, // Cache for 1 hour
    key: 'bouquets' // Custom cache key
  });

// Clear cache for the Product model
await cacheService.clearModelCache('Product');
```

### API Response Cache

The cache service also provides middleware for caching API responses:

```javascript
const { cacheAPIResponse } = require('../services/cache');

// Cache API responses for 1 hour
router.get('/products', cacheAPIResponse(3600), productController.getProducts);
```

## Backup Service

The backup service (`backup/`) provides database backup and restore functionality.

### Features

- Create database backups
- Restore from backups
- List available backups
- Clean up old backups based on retention policy
- Schedule regular backups

### Usage

```javascript
const backupService = require('../services/backup');

// Create a backup
const backup = await backupService.createBackup();

// List available backups
const backups = await backupService.listBackups();

// Restore from a backup
await backupService.restoreBackup('/path/to/backup');

// Clean up old backups
await backupService.cleanupBackups();

// Schedule regular backups
const scheduler = backupService.scheduleBackups('0 0 * * *'); // Daily at midnight
scheduler.start();
```

## Environment Variables

The following environment variables should be set for services to work properly:

### Cache Service
- `REDIS_URL`: Redis connection URL (default: 'redis://localhost:6379')
- `REDIS_TTL`: Default TTL for cached items in seconds (default: 3600)

### Backup Service
- `BACKUP_DIR`: Directory to store backups (default: './backups')
- `MONGO_URI`: MongoDB connection string (default: 'mongodb://localhost:27017/flora-shop')
- `BACKUP_RETENTION_DAYS`: Number of days to keep backups (default: 7)