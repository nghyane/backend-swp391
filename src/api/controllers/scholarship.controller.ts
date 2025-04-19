import { Request, Response } from "express";
import { scholarshipService } from "../../services/scholarship.service";
import { ScholarshipFilterOptions } from "../../types/scholarship.types";

/**
 * Controller for scholarship-related endpoints.
 */

/**
 * Get all scholarships with optional filtering
 */
const getAllScholarships = async (req: Request, res: Response): Promise<void> => {
  try {
    const filters: ScholarshipFilterOptions = {};
    
    if (req.query.name) {
      filters.name = req.query.name as string;
    }
    
    if (req.query.majorId) {
      filters.majorId = parseInt(req.query.majorId as string);
    }
    
    if (req.query.campusId) {
      filters.campusId = parseInt(req.query.campusId as string);
    }
    
    if (req.query.minAmount) {
      filters.minAmount = parseInt(req.query.minAmount as string);
    }
    
    const scholarships = await scholarshipService.getAllScholarships(filters);
    
    res.status(200).json({
      success: true,
      data: scholarships,
      count: scholarships.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve scholarships",
      error: (error as Error).message
    });
  }
};

/**
 * Get scholarship by ID
 */
const getScholarshipById = async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement getting scholarship by ID
  // 1. Extract scholarship ID from request params
  // 2. Fetch scholarship from database
  // 3. Return scholarship or 404 if not found
};

/**
 * Get scholarships by eligibility criteria
 */
const getScholarshipsByEligibility = async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement getting scholarships by eligibility
  // 1. Extract eligibility criteria from request body
  // 2. Fetch matching scholarships
  // 3. Return filtered scholarships array
};

/**
 * Get scholarships by major
 */
const getScholarshipsByMajor = async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement getting scholarships by major
  // 1. Extract major ID from request params
  // 2. Fetch scholarships for this major
  // 3. Return scholarships array
};

// Export all controller functions
export const scholarshipController = {
  getAllScholarships,
  getScholarshipById,
  getScholarshipsByEligibility,
  getScholarshipsByMajor
};
