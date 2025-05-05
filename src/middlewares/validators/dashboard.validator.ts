/**
 * Dashboard Validators
 * Validation middleware for dashboard routes
 */

import { z } from "zod";
import { createValidationMiddleware } from "./zod.validator";

// Schema for date range query parameters
const dateRangeSchema = z.object({
  start_date: z.string().optional().refine(
    (val) => !val || !isNaN(Date.parse(val)),
    { message: "Invalid start date format" }
  ),
  end_date: z.string().optional().refine(
    (val) => !val || !isNaN(Date.parse(val)),
    { message: "Invalid end date format" }
  )
}).refine(
  (data) => {
    if (data.start_date && data.end_date) {
      return new Date(data.start_date) <= new Date(data.end_date);
    }
    return true;
  },
  {
    message: "Start date must be before or equal to end date",
    path: ["start_date"]
  }
);

// Export validators
export const dashboardValidators = {
  dateRange: createValidationMiddleware({
    query: dateRangeSchema
  })
};
