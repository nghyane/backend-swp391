import { Request, Response } from "express";
import { admissionMethodService } from "../../services/admission-method.service";
import { AdmissionMethodFilterOptions } from "../../types/admission-method.types";

/**
 * Controller for admission method-related endpoints.
 */

/**
 * Get all admission methods
 */
const getAllAdmissionMethods = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get filter parameters from query string
    const filters: AdmissionMethodFilterOptions = {};
    
    if (req.query.name && typeof req.query.name === 'string') {
      filters.name = req.query.name;
    }
    
    // Get admission methods list from service
    const admissionMethods = await admissionMethodService.getAllAdmissionMethods(filters);
    
    // Return result
    res.status(200).json({
      success: true,
      data: admissionMethods,
      count: admissionMethods.length
    });
  } catch (error) {
    // Handle error
    res.status(500).json({
      success: false,
      message: "Failed to retrieve admission methods",
      error: (error as Error).message
    });
  }
};

/**
 * Get admission method by ID
 */
const getAdmissionMethodById = async (req: Request, res: Response): Promise<void> => {
  try {
    // ID has been validated and converted by middleware validator
    const id = parseInt(req.params.id);
    
    // Get admission method information from service
    const admissionMethod = await admissionMethodService.getAdmissionMethodById(id);
    
    // Check if not found
    if (!admissionMethod) {
      res.status(404).json({
        success: false,
        message: `Admission method not found with ID: ${id}`
      });
      return;
    }
    
    // Return result
    res.status(200).json({
      success: true,
      data: admissionMethod
    });
  } catch (error) {
    // Handle error
    res.status(500).json({
      success: false,
      message: "Failed to retrieve admission method information",
      error: (error as Error).message
    });
  }

};

/**
 * Get admission method requirements
 */
const getAdmissionMethodRequirements = async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement getting admission method requirements
  // 1. Extract admission method ID from request params
  // 2. Fetch requirements for this admission method
  // 3. Return requirements data
};

/**
 * Get admission methods by major
 */
const getAdmissionMethodsByMajor = async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement getting admission methods by major
  // 1. Extract major ID from request params
  // 2. Fetch admission methods for this major
  // 3. Return admission methods array
};

// Export all controller functions
export const admissionMethodController = {
  getAllAdmissionMethods,
  getAdmissionMethodById,
  getAdmissionMethodRequirements,
  getAdmissionMethodsByMajor
};
