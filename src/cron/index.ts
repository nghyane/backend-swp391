/**
 * Cron jobs manager
 * Quản lý các cron job trong ứng dụng
 */

import logger from '@/utils/pino-logger';
import { zaloTokenRefreshCron } from './zalo-token-refresh.cron';

/**
 * Khởi động tất cả cron job
 */
export const startAllCronJobs = (): void => {
  try {
    // Khởi động cron job làm mới token Zalo
    zaloTokenRefreshCron.start();
    
    logger.info('All cron jobs started successfully');
  } catch (error) {
    logger.error(error, 'Failed to start cron jobs');
  }
};

/**
 * Dừng tất cả cron job
 */
export const stopAllCronJobs = (): void => {
  try {
    // Dừng cron job làm mới token Zalo
    zaloTokenRefreshCron.stop();
    
    logger.info('All cron jobs stopped successfully');
  } catch (error) {
    logger.error(error, 'Failed to stop cron jobs');
  }
};
