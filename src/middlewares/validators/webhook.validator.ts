import { z } from 'zod';
import { validateZod } from './zod.validator';
import { WebhookPlatform } from '../../types/webhook.types';
import { Request, Response, NextFunction } from 'express';

// Export types inferred from schemas
export type WebhookPlatformParams = z.infer<typeof webhookPlatformSchema>;

/**
 * Schema for Webhook
 */
// Platform parameter schema
export const webhookPlatformSchema = z.object({
  platform: z.enum(['zalo'] as const, {
    errorMap: () => ({ message: "Platform must be one of: zalo" })
  })
}).strict();

/**
 * Validators for Webhook
 */
export const webhookValidators = {
  // Platform validator
  platform: validateZod(webhookPlatformSchema, 'params'),
  
  // Method validator
  method: (req: Request, res: Response, next: NextFunction): void => {
    const allowedMethods = ['GET', 'POST'];
    if (!allowedMethods.includes(req.method)) {
      res.status(405).json({
        error: "Method not allowed",
        message: `Method '${req.method}' is not supported for webhooks`
      });
      return;
    }
    next();
  }
};
