import { Request, Response } from "express";
import * as dormitoryService from "../../services/dormitory.service";
import { DormitoryFilterOptions } from "../../types/dormitory.types";

/**
 * Controller for dormitory-related endpoints.
 */

/**
 * Get all dormitories with optional filtering
 */
const getAllDormitories = async (req: Request, res: Response): Promise<void> => {
  try {
    // Trích xuất tham số lọc từ query
    const filters: DormitoryFilterOptions = {};
    
    if (req.query.name) {
      filters.name = req.query.name as string;
    }
    
    if (req.query.campusId && !isNaN(Number(req.query.campusId))) {
      filters.campusId = Number(req.query.campusId);
    }
    
    if (req.query.priceMin && !isNaN(Number(req.query.priceMin))) {
      filters.priceMin = Number(req.query.priceMin);
    }
    
    if (req.query.priceMax && !isNaN(Number(req.query.priceMax))) {
      filters.priceMax = Number(req.query.priceMax);
    }
    
    // Lấy danh sách ký túc xá từ service
    const dormitories = await dormitoryService.getAllDormitories(filters);
    
    // Trả về kết quả
    res.status(200).json({
      success: true,
      data: dormitories,
      count: dormitories.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve dormitories",
      error: (error as Error).message
    });
  }
};

/**
 * Get dormitory by ID
 */
const getDormitoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    // Lấy dormitory ID từ params
    const dormitoryId = Number(req.params.id);
    
    // Kiểm tra ID có hợp lệ không
    if (isNaN(dormitoryId)) {
      res.status(400).json({
        success: false,
        message: "Invalid dormitory ID format"
      });
      return;
    }
    
    try {
      // Lấy thông tin ký túc xá từ service
      const dormitory = await dormitoryService.getDormitoryById(dormitoryId);
      
      // Trả về kết quả
      res.status(200).json({
        success: true,
        data: dormitory
      });
    } catch (error) {
      // Xử lý trường hợp không tìm thấy ký túc xá
      if ((error as Error).message === "Dormitory not found") {
        res.status(404).json({
          success: false,
          message: "Dormitory not found"
        });
      } else {
        throw error; // Re-throw để xử lý ở catch bên ngoài
      }
    }
  } catch (error) {
    // Xử lý lỗi chung
    res.status(500).json({
      success: false,
      message: "Failed to retrieve dormitory",
      error: (error as Error).message
    });
  }
};

/**
 * Get dormitory availability
 */
const getDormitoryAvailability = async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement getting dormitory availability
  // 1. Extract dormitory ID from request params
  // 2. Fetch availability information
  // 3. Return availability data
};

/**
 * Get dormitory facilities
 */
const getDormitoryFacilities = async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement getting dormitory facilities
  // 1. Extract dormitory ID from request params
  // 2. Fetch facilities information
  // 3. Return facilities data
};

// Export all controller functions
export const dormitoryController = {
  getAllDormitories,
  getDormitoryById,
  getDormitoryAvailability,
  getDormitoryFacilities
};
