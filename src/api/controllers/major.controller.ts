import { Request, Response } from "express";
import { majorService } from "../../services/major.service";

/**
 * Controller for major-related endpoints.
 */

/**
 * Get all majors
 */
const getAllMajors = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch all majors from database
    const majors = await majorService.getAllMajors();
    
    // Return majors array
    res.json({
      success: true,
      data: majors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

/**
 * Get major by ID
 */
const getMajorById = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract major ID from request params
    const id = Number(req.params.id);
    
    // Validate ID
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid major ID format'
      });
      return;
    }
    
    // Fetch major from database
    const major = await majorService.getMajorById(id);
    
    // Return 404 if major not found
    if (!major) {
      res.status(404).json({
        success: false,
        error: 'Major not found'
      });
      return;
    }
    
    // Return major data
    res.json({
      success: true,
      data: major
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
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
