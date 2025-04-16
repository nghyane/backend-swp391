import { Request, Response } from "express";

/**
 * Controller for major-related endpoints.
 */

/**
 * Get all majors with optional filtering
 */
const getAllMajors = async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement getting all majors
  // 1. Extract filter parameters from request query
  // 2. Fetch majors from database with filtering
  // 3. Return majors array
};

/**
 * Get major by ID
 */
const getMajorById = async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement getting major by ID
  // 1. Extract major ID from request params
  // 2. Fetch major from database
  // 3. Return major or 404 if not found
};

/**
 * Search majors by keyword
 */
const searchMajors = async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement major search
  // 1. Extract search keyword from request query
  // 2. Search majors in database
  // 3. Return matching majors
};

/**
 * Get majors by campus
 */
const getMajorsByCampus = async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement getting majors by campus
  // 1. Extract campus ID from request params
  // 2. Fetch majors for this campus
  // 3. Return majors array
};

// Export all controller functions
export const majorController = {
  getAllMajors,
  getMajorById,
  searchMajors,
  getMajorsByCampus
};
