import { Request, Response } from "express";
import * as dormitoryService from "../../services/dormitory.service";
import { DormitoryFilterOptions } from "../../types/dormitory.types";
import { asyncHandler } from "../../utils/async-handler";

const getAllDormitories = async (req: Request, res: Response): Promise<void> => {
  const filters: DormitoryFilterOptions = {};
  
  if (req.query.name) filters.name = req.query.name as string;
  if (req.query.campusId) filters.campusId = Number(req.query.campusId);
  if (req.query.priceMin) filters.priceMin = Number(req.query.priceMin);
  if (req.query.priceMax) filters.priceMax = Number(req.query.priceMax);
  
  const dormitories = await dormitoryService.getAllDormitories(filters);
  
  res.status(200).json({
    success: true,
    data: dormitories,
    count: dormitories.length
  });
};

const getDormitoryById = async (req: Request, res: Response): Promise<void> => {
  const dormitoryId = Number(req.params.id);
  const dormitory = await dormitoryService.getDormitoryById(dormitoryId);
  
  res.status(200).json({
    success: true,
    data: dormitory
  });
};

const getDormitoryAvailability = async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement getting dormitory availability
};

const getDormitoryFacilities = async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement getting dormitory facilities
};

export const dormitoryController = {
  getAllDormitories: asyncHandler(getAllDormitories),
  getDormitoryById: asyncHandler(getDormitoryById),
  getDormitoryAvailability: asyncHandler(getDormitoryAvailability),
  getDormitoryFacilities: asyncHandler(getDormitoryFacilities)
};
