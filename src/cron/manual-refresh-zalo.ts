/**
 * Script để làm mới token Zalo thủ công
 * Sử dụng: bun run token:refresh-zalo:manual
 */

import { manualRefreshZaloToken } from './zalo-token-refresh.cron';

// Chạy hàm làm mới token
manualRefreshZaloToken()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error refreshing Zalo token:', error);
    process.exit(1);
  });
