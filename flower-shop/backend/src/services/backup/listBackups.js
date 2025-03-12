const backupService = require('./index');
const logger = require('../../utils/logger');

// Load environment variables if not already loaded
require('dotenv').config();

/**
 * Script to list available database backups
 */
async function listBackups() {
  try {
    logger.info('Listing available database backups');
    
    // Get list of backups
    const backups = await backupService.listBackups();
    
    // Log and display results
    logger.info(`Found ${backups.length} backups`);
    
    console.log('Available database backups:');
    console.log('==========================================');
    
    if (backups.length === 0) {
      console.log('No backups found.');
    } else {
      console.log(`Total backups: ${backups.length}`);
      console.log('');
      
      // Print backup details
      backups.forEach((backup, index) => {
        console.log(`${index + 1}. ${backup.name}`);
        console.log(`   Path: ${backup.path}`);
        console.log(`   Date: ${new Date(backup.timestamp).toLocaleString()}`);
        console.log(`   Size: ${formatBytes(backup.size)}`);
        console.log('------------------------------------------');
      });
    }
    
    process.exit(0);
  } catch (error) {
    logger.error('Failed to list backups', {
      error: error.message,
      stack: error.stack
    });
    
    console.error(`Failed to list backups: ${error.message}`);
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

// List backups
listBackups();