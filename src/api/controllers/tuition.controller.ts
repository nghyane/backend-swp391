import { Request, Response } from "express";

/**
 * Controller for tuition-related endpoints.
 */

/**
 * Get general tuition information
 */
const getTuitionInfo = async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement getting general tuition information
  // 1. Fetch tuition information from database
  // 2. Format response data
  // 3. Return tuition information
};

/**
 * Get tuition information by major
 */
const getTuitionByMajor = async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement getting tuition by major
  // 1. Extract major ID from request params
  // 2. Fetch tuition information for this major
  // 3. Return tuition information or 404 if not found
};

/**
 * Get tuition comparison between majors
 */
const compareTuition = async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement tuition comparison
  // 1. Extract major IDs from request query
  // 2. Fetch tuition information for selected majors
  // 3. Format comparison data
  // 4. Return comparison results
};

// Export all controller functions
export const tuitionController = {
  getTuitionInfo,
  getTuitionByMajor,
  compareTuition
};
