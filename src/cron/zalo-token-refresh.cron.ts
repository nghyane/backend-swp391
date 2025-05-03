/**
 * Cron job để tự động làm mới token Zalo
 * Chạy mỗi 50 phút (token Zalo hết hạn sau 1 giờ)
 */

import cron from 'node-cron';
import { createNamespace } from '@/utils/pino-logger';
import { zaloWebhookService } from '@integration/zalo.service';

// Tạo logger riêng cho cron job
const logger = createNamespace('zalo-token-cron');

/**
 * Hàm làm mới token Zalo
 * Được gọi bởi cron job
 */
const refreshZaloTokenTask = async (): Promise<void> => {
  try {
    logger.info('Starting scheduled Zalo token refresh');
    
    const newToken = await zaloWebhookService.refreshZaloToken();
    
    if (newToken) {
      logger.info('Scheduled Zalo token refresh completed successfully');
    } else {
      logger.error('Scheduled Zalo token refresh failed');
    }
  } catch (error) {
    logger.error(error, 'Error in scheduled Zalo token refresh');
  }
};

/**
 * Cron job làm mới token Zalo
 * Chạy mỗi 50 phút (token Zalo hết hạn sau 1 giờ)
 * 
 * Cron expression: '0 */50 * * * *'
 * - Giây: 0 (chạy vào giây thứ 0)
 * - Phút: */50 (chạy mỗi 50 phút)
 * - Giờ: * (mọi giờ)
 * - Ngày trong tháng: * (mọi ngày)
 * - Tháng: * (mọi tháng)
 * - Ngày trong tuần: * (mọi ngày trong tuần)
 */
export const zaloTokenRefreshCron = cron.schedule('0 */50 * * * *', refreshZaloTokenTask, {
  scheduled: false, // Không tự động khởi động, sẽ được khởi động trong startAllCronJobs
  timezone: 'Asia/Ho_Chi_Minh' // Múi giờ Việt Nam
});

// Export hàm làm mới token để có thể gọi thủ công nếu cần
export const manualRefreshZaloToken = refreshZaloTokenTask;
