/**
 * Types for Facebook Messenger webhook integration
 */

export type FacebookWebhookEvent = {
  sender: {
    id: string;
  };
  recipient: {
    id: string;
  };
  timestamp: number;
  message?: {
    mid: string;
    text: string;
  };
  postback?: {
    title: string;
    payload: string;
  };
};

export type FacebookMessageResponse = {
  recipient_id: string;
  message_id: string;
};

export type FacebookSendMessageRequest = {
  recipient: {
    id: string;
  };
  message: {
    text: string;
  };
};
