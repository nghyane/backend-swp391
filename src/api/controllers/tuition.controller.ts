import { Request, Response } from "express";


/**
 * Get tuition information by major
 */
const getTuitionByMajor = async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement getting tuition by major
  // 1. Extract major ID from request params
  // 2. Fetch tuition information for this major
  // 3. Return tuition information or 404 if not found
};


// Export all controller functions
export const tuitionController = {
  getTuitionByMajor,
};
