/**
 * Script to refresh Zalo token
 * This script can be run manually or scheduled to run periodically
 * to ensure Zalo tokens are always valid
 */

import { zaloWebhookService } from '../services/integration/zalo.service';
import logger from '../utils/pino-logger';

async function main() {
  try {
    logger.info('Starting Zalo token refresh script');
    
    const newToken = await zaloWebhookService.refreshZaloToken();
    
    if (newToken) {
      logger.info('Zalo token refreshed successfully');
      process.exit(0);
    } else {
      logger.error('Failed to refresh Zalo token');
      process.exit(1);
    }
  } catch (error) {
    logger.error(error, 'Error in Zalo token refresh script');
    process.exit(1);
  }
}

// Run the script
main();
