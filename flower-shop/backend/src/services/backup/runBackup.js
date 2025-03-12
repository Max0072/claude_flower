const backupService = require('./index');
const logger = require('../../utils/logger');

// Load environment variables if not already loaded
require('dotenv').config();

/**
 * Script to run a database backup
 */
async function runBackup() {
  try {
    logger.info('Starting database backup process');
    
    // Run backup
    const result = await backupService.createBackup();
    
    // Log results
    logger.info('Backup completed successfully', {
      path: result.path,
      timestamp: result.timestamp,
      size: formatBytes(result.size)
    });
    
    // Clean up old backups
    const cleanupResult = await backupService.cleanupBackups();
    logger.info('Backup cleanup completed', {
      deleted: cleanupResult.deleted,
      remaining: cleanupResult.remainingBackups
    });
    
    console.log(`Backup completed successfully at: ${result.path}`);
    console.log(`Backup size: ${formatBytes(result.size)}`);
    console.log(`Cleaned up ${cleanupResult.deleted} old backups`);
    
    process.exit(0);
  } catch (error) {
    logger.error('Backup failed', {
      error: error.message,
      stack: error.stack
    });
    
    console.error(`Backup failed: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Format bytes to a human-readable format
 * @param {number} bytes - Bytes to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted string
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Run backup
runBackup();