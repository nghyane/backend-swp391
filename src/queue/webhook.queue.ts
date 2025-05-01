/**
 * Webhook Queue for processing webhook events asynchronously
 */
import fastq from 'fastq';
import type { queueAsPromised } from 'fastq';
import { ZaloWebhookEvent } from '@/types/webhook.types';
import { handleUserSendText } from '@/services/integration/zalo.service';
import { createNamespace } from '@/utils/pino-logger';

// Create a namespace logger for Zalo queue
const logger = createNamespace('zalo-queue');

export const zaloQueue: queueAsPromised<ZaloWebhookEvent, void> = fastq.promise(
  async (eventData: ZaloWebhookEvent) => {
    logger.info({ event: eventData.event_name }, 'Processing Zalo webhook event');

    if (eventData.event_name === 'user_send_text' || eventData.event_name === 'anonymous_send_text') {
      await handleUserSendText(eventData);
    }
  },
  5
);

export const queueZaloMessage = (eventData: ZaloWebhookEvent): void => {
  zaloQueue.push(eventData).catch(err =>
    logger.error({ err }, 'Failed to process Zalo message')
  );
};

zaloQueue.error((err, task) => {
  if (err) {
    logger.error({ err, task: JSON.stringify(task) }, 'Error processing Zalo webhook');
  }
});
