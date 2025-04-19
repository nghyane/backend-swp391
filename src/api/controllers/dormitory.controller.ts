import { Request, Response } from "express";
import * as dormitoryService from "../../services/dormitory.service";
import { DormitoryFilterOptions } from "../../types/dormitory.types";
import { catch$ } from "../../utils/catch";

export const getAllDormitories = catch$(async (req: Request, res: Response): Promise<void> => {
  const filters: DormitoryFilterOptions = {};
  
  if (req.query.name) filters.name = req.query.name as string;
  if (req.query.campusId) filters.campusId = parseInt(req.query.campusId as string);
  if (req.query.priceMin) filters.priceMin = parseInt(req.query.priceMin as string);
  if (req.query.priceMax) filters.priceMax = parseInt(req.query.priceMax as string);
  
  const dormitories = await dormitoryService.getAllDormitories(filters);
  
  res.status(200).json({
    success: true,
    data: dormitories,
    count: dormitories.length
  });
});

export const getDormitoryById = catch$(async (req: Request, res: Response): Promise<void> => {
  const dormitoryId = parseInt(req.params.id);
  const dormitory = await dormitoryService.getDormitoryById(dormitoryId);
  
  res.status(200).json({
    success: true,
    data: dormitory
  });
});

export const getDormitoryAvailability = catch$(async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({
    success: false,
    message: "Not implemented yet"
  });
});

export const getDormitoryFacilities = catch$(async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({
    success: false,
    message: "Not implemented yet"
  });
});

