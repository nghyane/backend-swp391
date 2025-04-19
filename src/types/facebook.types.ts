/**
 * Types for Facebook Messenger webhook integration
 */

/**
 * Event received from Facebook webhook
 */
export type FacebookWebhookEvent = {
  readonly sender: {
    readonly id: string;
  };
  readonly recipient: {
    readonly id: string;
  };
  readonly timestamp: number;
  readonly message?: {
    readonly mid: string;
    readonly text: string;
  };
  readonly postback?: {
    readonly title: string;
    readonly payload: string;
  };
};

/**
 * Response from Facebook when sending a message
 */
export type FacebookMessageResponse = {
  readonly recipient_id: string;
  readonly message_id: string;
};

/**
 * Request to send a message to Facebook
 */
export type FacebookSendMessageRequest = {
  readonly recipient: {
    readonly id: string;
  };
  readonly message: {
    readonly text: string;
  };
};
