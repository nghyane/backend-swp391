import { Request, Response } from "express";
import { majorService } from "../../services/major.service";
import { MajorFilterOptions } from "../../types/major.types";

/**
 * Controller for major-related endpoints.
 */

/**
 * Get all majors with optional filtering
 */
const getAllMajors = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, code, description } = req.query;
    
    const filters: MajorFilterOptions = {
      ...(name ? { name: String(name) } : {}),
      ...(code ? { code: String(code) } : {}),
      ...(description ? { description: String(description) } : {})
    };
    
    const hasFilters = Object.keys(filters).length > 0;
    
    const majors = await majorService.getAllMajors(
      hasFilters ? filters : undefined
    );
    
    res.json({
      success: true,
      data: majors,
      filters: hasFilters ? filters : undefined
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
  getMajorsByCampus
};
