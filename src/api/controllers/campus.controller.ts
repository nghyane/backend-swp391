import { Request, Response } from "express";
import { campusService } from "../../services/campus.service";

/**
 * Controller for campus-related endpoints.
 */

/**
 * Get all campuses with optional filtering
 */
const getAllCampuses = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, address } = req.query;
    
    const filters = {
      ...(name ? { name: String(name) } : {}),
      ...(address ? { address: String(address) } : {})
    };
    
    const hasFilters = Object.keys(filters).length > 0;
    
    const campuses = await campusService.getAllCampuses(
      hasFilters ? filters : undefined
    );
    
    res.json({
      success: true,
      data: campuses,
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
 * Get campus by ID
 */
const getCampusById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: 'Invalid campus ID format'
      });
      return;
    }
    
    const campus = await campusService.getCampusById(id);
    
    if (!campus) {
      res.status(404).json({
        success: false,
        error: 'Campus not found'
      });
      return;
    }
    
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


// Export all controller functions
export const campusController = {
  getAllCampuses,
  getCampusById,
};
