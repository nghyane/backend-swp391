import { Request, Response } from "express";
import { campusService } from "../../services/campus.service";

/**
 * Controller for campus-related endpoints.
 */

/**
 * Get all campuses
 */
const getAllCampuses = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch all campuses from database
    const campuses = await campusService.getAllCampuses();
    
    // Return campuses array
    res.json({
      success: true,
      data: campuses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

/**
 * Get campus by ID
 */
const getCampusById = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract campus ID from request params
    const id = Number(req.params.id);
    
    // Validate ID
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid campus ID format'
      });
      return;
    }
    
    // Fetch campus from database
    const campus = await campusService.getCampusById(id);
    
    // Return 404 if campus not found
    if (!campus) {
      res.status(404).json({
        success: false,
        error: 'Campus not found'
      });
      return;
    }
    
    // Return campus data
    res.json({
      success: true,
      data: campus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

/**
 * Get campus facilities
 */
const getCampusFacilities = async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement getting campus facilities
  // 1. Extract campus ID from request params
  // 2. Fetch facilities for this campus
  // 3. Return facilities array
};

/**
 * Get campus location information
 */
const getCampusLocation = async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement getting campus location
  // 1. Extract campus ID from request params
  // 2. Fetch location information
  // 3. Return location data including coordinates
};

// Export all controller functions
export const campusController = {
  getAllCampuses,
  getCampusById,
  getCampusFacilities,
  getCampusLocation
};
