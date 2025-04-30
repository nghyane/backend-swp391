/**
 * Webhook Queue for processing webhook events asynchronously
 */
import fastq from 'fastq';
import type { queueAsPromised } from 'fastq';
import { ZaloWebhookEvent } from '@/types/webhook.types';
import { handleUserSendText } from '@/services/integration/webhook/zalo-webhook.service';
import { logger } from '@/utils/logger';

export const zaloQueue: queueAsPromised<ZaloWebhookEvent, void> = fastq.promise(
  async (eventData: ZaloWebhookEvent) => {
    logger.info('Processing Zalo webhook event:', eventData.event_name);

    if (eventData.event_name === 'user_send_text' || eventData.event_name === 'anonymous_send_text') {
      await handleUserSendText(eventData);
    }
  },
  5
);

export const queueZaloMessage = (eventData: ZaloWebhookEvent): void => {
  zaloQueue.push(eventData).catch(err =>
    logger.error('Failed to process Zalo message:', err)
  );
};

zaloQueue.error((err, task) => {
  if (err) {
    logger.error('Error processing Zalo webhook:', err, task);
  }
});
