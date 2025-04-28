import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { replyError } from '../../utils/response';

/**
 * Handle validation errors from Zod
 */
export const handleZodError = (
  error: z.ZodError,
  res: Response
): void => {
  // Get the first error to display as the main message
  const firstError = error.errors[0];
  const field = firstError.path.join('.');
  const message = `Validation error: ${firstError.message}`;

  // Include all validation errors in error details
  const errorDetails = JSON.stringify(error.errors);

  replyError(res, message, 400, field, errorDetails);
};

/**
 * Middleware to validate request with Zod schema
 */
/**
 * Extend Express Request interface to include our validated data properties
 */
declare global {
  namespace Express {
    interface Request {
      validatedQuery?: Record<string, any>;
      validatedParams?: Record<string, any>;
    }
  }
}

/**
 * Middleware validate request với Zod schema
 * @template T Type được suy ra từ schema
 */
export const validateZod = <T extends z.ZodTypeAny>(
  schema: T,
  source: 'body' | 'query' | 'params' = 'body'
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse and validate the data
      const validatedData = schema.parse(req[source]) as z.infer<T>;

      // Store validated data in a safe way without overwriting read-only properties
      if (source === 'query') {
        // For query params, attach the validated data to req object without overwriting
        req.validatedQuery = validatedData;
      } else if (source === 'params') {
        // For route params, attach the validated data to req object without overwriting
        req.validatedParams = validatedData;
      } else {
        // For body, we can safely overwrite as it's not read-only
        req.body = validatedData;
      }

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return handleZodError(error, res);
      }
      next(error);
    }
  };
};

// Schema for common query parameters
export const commonQuerySchema = z.object({
  // Pagination
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),

  // Sorting
  sort_by: z.string().optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),

  // Filtering
  name: z.string().optional(),
}).strict().partial();

// Schema for ID in params
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive()
}).strict();

/**
 * Create schema for param with custom name
 */
export const createParamSchema = (paramName: string) => {
  return z.object({
    [paramName]: z.coerce.number().int().positive()
  }).strict();
};

/**
 * Common param validators
 */
export const validateId = validateZod(idParamSchema, 'params');

// Common entity ID validators
export const validateCampusId = validateZod(createParamSchema('campusId'), 'params');
export const validateMajorId = validateZod(createParamSchema('majorId'), 'params');
export const validateScholarshipId = validateZod(createParamSchema('scholarshipId'), 'params');
export const validateDormitoryId = validateZod(createParamSchema('dormitoryId'), 'params');
export const validateAdmissionMethodId = validateZod(createParamSchema('admissionMethodId'), 'params');
export const validateMajorCode = validateZod(createParamSchema('majorCode'), 'params');
/**
 * Custom param validator
 */
export const validateParam = (paramName: string) => {
  const schema = createParamSchema(paramName);
  return validateZod(schema, 'params');
};

/**
 * Middleware to validate common queries
 */
export const validateCommonQuery = validateZod(commonQuerySchema, 'query');
