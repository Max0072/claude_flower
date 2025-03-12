const backupService = require('./index');
const logger = require('../../utils/logger');
const readline = require('readline');

// Load environment variables if not already loaded
require('dotenv').config();

/**
 * Script to restore a database from backup
 */
async function restoreBackup() {
  try {
    const args = process.argv.slice(2);
    let backupPath;
    
    // If no path provided, show available backups and prompt for selection
    if (args.length === 0) {
      const backups = await backupService.listBackups();
      
      if (backups.length === 0) {
        console.log('No backups found.');
        process.exit(0);
      }
      
      console.log('Available database backups:');
      console.log('==========================================');
      
      backups.forEach((backup, index) => {
        console.log(`${index + 1}. ${backup.name}`);
        console.log(`   Date: ${new Date(backup.timestamp).toLocaleString()}`);
        console.log(`   Size: ${formatBytes(backup.size)}`);
        console.log('------------------------------------------');
      });
      
      // Prompt for backup selection
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const answer = await new Promise((resolve) => {
        rl.question('\nEnter the number of the backup to restore: ', resolve);
      });
      
      rl.close();
      
      const selection = parseInt(answer, 10);
      if (isNaN(selection) || selection < 1 || selection > backups.length) {
        console.error('Invalid selection.');
        process.exit(1);
      }
      
      backupPath = backups[selection - 1].path;
    } else {
      backupPath = args[0];
    }
    
    console.log(`\nWARNING: This will replace the current database with the backup at ${backupPath}.`);
    console.log('All current data will be lost.');
    
    // Confirm restore
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const confirmation = await new Promise((resolve) => {
      rl.question('\nDo you want to continue? (yes/no): ', resolve);
    });
    
    rl.close();
    
    if (confirmation.toLowerCase() !== 'yes') {
      console.log('Restore operation cancelled.');
      process.exit(0);
    }
    
    logger.info(`Starting database restore from ${backupPath}`);
    console.log('\nRestoring database...');
    
    // Restore from backup
    const result = await backupService.restoreBackup(backupPath);
    
    logger.info('Database restore completed successfully', {
      path: result.path
    });
    
    console.log('Database restore completed successfully!');
    
    process.exit(0);
  } catch (error) {
    logger.error('Restore failed', {
      error: error.message,
      stack: error.stack
    });
    
    console.error(`Restore failed: ${error.message}`);
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

// Restore backup
restoreBackup();