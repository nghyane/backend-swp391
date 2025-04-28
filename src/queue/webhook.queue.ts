/**
 * Webhook Queue
 * Lightweight queue for processing webhook events asynchronously
 */

import fastq from 'fastq';
import type { queueAsPromised } from 'fastq';
import { ZaloWebhookEvent } from '../types/webhook.types';
import { handleUserSendText } from '../services/webhook/zalo-webhook.service';

// Create queue with concurrency of 5
export const zaloQueue: queueAsPromised<ZaloWebhookEvent, void> = fastq.promise(
  // Process function as inline arrow function
  async (eventData: ZaloWebhookEvent) => {
    console.log('Processing Zalo webhook event:', eventData.event_name);
    
    if (eventData.event_name === 'user_send_text' || eventData.event_name === 'anonymous_send_text') {
      await handleUserSendText(eventData);
    }
  }, 
  5
);

/**
 * Add a Zalo webhook event to the processing queue
 */
export const queueZaloMessage = (eventData: ZaloWebhookEvent): void => {
  // Push to queue without awaiting
  zaloQueue.push(eventData).catch(err => 
    console.error('Failed to process Zalo message:', err)
  );
};

// Global error handler for the queue
zaloQueue.error((err, task) => 
  err ? console.error('Error processing Zalo webhook:', err, task) : console.log('Ok!')
);
