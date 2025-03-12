const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const logger = require('../../utils/logger');

// Configuration
const BACKUP_DIR = process.env.BACKUP_DIR || path.join(process.cwd(), 'backups');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/flora-shop';
const RETENTION_DAYS = parseInt(process.env.BACKUP_RETENTION_DAYS || '7', 10);

/**
 * Initialize backup directory
 * @returns {Promise<boolean>} Success status
 */
const initializeBackupDir = async () => {
  try {
    // Create backup directory if it doesn't exist
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
      logger.info(`Created backup directory: ${BACKUP_DIR}`);
    }
    return true;
  } catch (error) {
    logger.error('Failed to initialize backup directory', {
      error: error.message,
      backupDir: BACKUP_DIR
    });
    return false;
  }
};

/**
 * Create database backup using mongodump
 * @returns {Promise<Object>} Backup result
 */
exports.createBackup = async () => {
  try {
    await initializeBackupDir();
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}`);
    
    logger.info(`Starting database backup to ${backupPath}`);
    
    return new Promise((resolve, reject) => {
      // Parse MongoDB URI to extract credentials and database name
      const dbUrl = new URL(MONGO_URI);
      const database = dbUrl.pathname.substring(1); // Remove leading slash
      
      // Build mongodump command
      const args = ['--out', backupPath];
      
      // Add host and port
      args.push('--host', dbUrl.hostname);
      if (dbUrl.port) {
        args.push('--port', dbUrl.port);
      }
      
      // Add authentication if provided
      if (dbUrl.username && dbUrl.password) {
        args.push('-u', dbUrl.username, '-p', dbUrl.password);
      }
      
      // Add database name
      if (database) {
        args.push('--db', database);
      }
      
      // Add authentication database if in URI
      const authSource = dbUrl.searchParams.get('authSource');
      if (authSource) {
        args.push('--authenticationDatabase', authSource);
      }
      
      // Run mongodump command
      const mongodump = spawn('mongodump', args);
      
      let stdout = '';
      let stderr = '';
      
      mongodump.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      
      mongodump.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      mongodump.on('close', (code) => {
        if (code === 0) {
          logger.info('Database backup completed successfully', {
            backupPath,
            size: getDirSize(backupPath)
          });
          
          resolve({
            success: true,
            path: backupPath,
            timestamp,
            size: getDirSize(backupPath)
          });
        } else {
          logger.error('Database backup failed', {
            code,
            stderr
          });
          
          reject(new Error(`Backup failed with code ${code}: ${stderr}`));
        }
      });
      
      mongodump.on('error', (err) => {
        logger.error('Failed to start mongodump', {
          error: err.message
        });
        reject(err);
      });
    });
  } catch (error) {
    logger.error('Error creating database backup', {
      error: error.message
    });
    throw error;
  }
};

/**
 * Restore database from backup
 * @param {string} backupPath - Path to backup directory
 * @returns {Promise<Object>} Restore result
 */
exports.restoreBackup = async (backupPath) => {
  try {
    if (!fs.existsSync(backupPath)) {
      throw new Error(`Backup path not found: ${backupPath}`);
    }
    
    logger.info(`Starting database restore from ${backupPath}`);
    
    return new Promise((resolve, reject) => {
      // Parse MongoDB URI to extract credentials and database name
      const dbUrl = new URL(MONGO_URI);
      const database = dbUrl.pathname.substring(1); // Remove leading slash
      
      // Build mongorestore command
      const args = ['--dir', backupPath];
      
      // Add host and port
      args.push('--host', dbUrl.hostname);
      if (dbUrl.port) {
        args.push('--port', dbUrl.port);
      }
      
      // Add authentication if provided
      if (dbUrl.username && dbUrl.password) {
        args.push('-u', dbUrl.username, '-p', dbUrl.password);
      }
      
      // Add database name
      if (database) {
        args.push('--db', database);
      }
      
      // Add authentication database if in URI
      const authSource = dbUrl.searchParams.get('authSource');
      if (authSource) {
        args.push('--authenticationDatabase', authSource);
      }
      
      // Drop existing collections before restore
      args.push('--drop');
      
      // Run mongorestore command
      const mongorestore = spawn('mongorestore', args);
      
      let stdout = '';
      let stderr = '';
      
      mongorestore.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      
      mongorestore.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      mongorestore.on('close', (code) => {
        if (code === 0) {
          logger.info('Database restore completed successfully', {
            backupPath
          });
          
          resolve({
            success: true,
            path: backupPath
          });
        } else {
          logger.error('Database restore failed', {
            code,
            stderr
          });
          
          reject(new Error(`Restore failed with code ${code}: ${stderr}`));
        }
      });
      
      mongorestore.on('error', (err) => {
        logger.error('Failed to start mongorestore', {
          error: err.message
        });
        reject(err);
      });
    });
  } catch (error) {
    logger.error('Error restoring database backup', {
      error: error.message,
      backupPath
    });
    throw error;
  }
};

/**
 * List available backups
 * @returns {Promise<Array>} List of backups
 */
exports.listBackups = async () => {
  try {
    await initializeBackupDir();
    
    const files = fs.readdirSync(BACKUP_DIR);
    
    // Filter directories that match our backup naming pattern
    const backupDirs = files.filter(file => {
      const fullPath = path.join(BACKUP_DIR, file);
      return fs.statSync(fullPath).isDirectory() && file.startsWith('backup-');
    });
    
    // Get details for each backup
    const backups = backupDirs.map(dir => {
      const fullPath = path.join(BACKUP_DIR, dir);
      const stat = fs.statSync(fullPath);
      
      // Extract timestamp from directory name
      const timestamp = dir.replace('backup-', '');
      const date = new Date(timestamp.replace(/-/g, ':').replace('T', ' '));
      
      return {
        name: dir,
        path: fullPath,
        timestamp: date.toISOString(),
        size: getDirSize(fullPath),
        createdAt: stat.ctime
      };
    });
    
    // Sort by creation date (newest first)
    backups.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return backups;
  } catch (error) {
    logger.error('Error listing backups', {
      error: error.message
    });
    throw error;
  }
};

/**
 * Clean up old backups based on retention policy
 * @returns {Promise<Object>} Cleanup result
 */
exports.cleanupBackups = async () => {
  try {
    const backups = await exports.listBackups();
    
    // Keep only the backups older than retention period
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - RETENTION_DAYS);
    
    const oldBackups = backups.filter(backup => 
      new Date(backup.createdAt) < cutoffDate
    );
    
    if (oldBackups.length === 0) {
      logger.info('No old backups to clean up');
      return { success: true, deleted: 0 };
    }
    
    // Delete old backups
    let deletedCount = 0;
    for (const backup of oldBackups) {
      try {
        deleteDirRecursive(backup.path);
        deletedCount++;
        logger.info(`Deleted old backup: ${backup.name}`);
      } catch (err) {
        logger.error(`Failed to delete backup ${backup.name}`, {
          error: err.message
        });
      }
    }
    
    logger.info(`Backup cleanup completed: ${deletedCount} old backups deleted`);
    
    return {
      success: true,
      deleted: deletedCount,
      totalBackups: backups.length,
      remainingBackups: backups.length - deletedCount
    };
  } catch (error) {
    logger.error('Error cleaning up backups', {
      error: error.message
    });
    throw error;
  }
};

/**
 * Schedule regular backups
 * @param {string} schedule - Cron schedule string
 * @returns {Object} Scheduled job
 */
exports.scheduleBackups = (schedule = '0 0 * * *') => {
  // This would typically use a scheduling library like node-cron
  // For now, we'll just log that it would be scheduled
  logger.info(`Database backups would be scheduled with cron: ${schedule}`);
  
  return {
    schedule,
    start: () => {
      logger.info('Backup scheduler started');
    },
    stop: () => {
      logger.info('Backup scheduler stopped');
    }
  };
};

/**
 * Calculate directory size recursively
 * @param {string} dirPath - Directory path
 * @returns {number} Size in bytes
 */
function getDirSize(dirPath) {
  let size = 0;
  
  if (!fs.existsSync(dirPath)) {
    return 0;
  }
  
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      size += getDirSize(filePath);
    } else {
      size += stat.size;
    }
  }
  
  return size;
}

/**
 * Delete directory recursively
 * @param {string} dirPath - Directory path
 */
function deleteDirRecursive(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return;
  }
  
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    
    if (fs.statSync(filePath).isDirectory()) {
      deleteDirRecursive(filePath);
    } else {
      fs.unlinkSync(filePath);
    }
  }
  
  fs.rmdirSync(dirPath);
}