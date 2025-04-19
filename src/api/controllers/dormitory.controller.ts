import { Request, Response } from "express";
import * as dormitoryService from "../../services/dormitory.service";
import { Dormitory, DormitoryFilterOptions } from "../../types/dormitory.types";
import { catch$ } from "../../utils/catch";

export const getAllDormitories = catch$(async (req: Request, res: Response): Promise<void> => {
  const { name, campusId, priceMin, priceMax } = req.query;
  
  const filters: DormitoryFilterOptions = {
    ...(name ? { name: String(name) } : {}),
    ...(campusId ? { campusId: Number(campusId) } : {}),
    ...(priceMin ? { priceMin: Number(priceMin) } : {}),
    ...(priceMax ? { priceMax: Number(priceMax) } : {})
  };
  
  const hasFilters = Object.keys(filters).length > 0;
  const dormitories = await dormitoryService.getAllDormitories(hasFilters ? filters : undefined);
  
  res.json({
    success: true,
    data: dormitories,
    count: dormitories.length,
    filters: hasFilters ? filters : undefined
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

