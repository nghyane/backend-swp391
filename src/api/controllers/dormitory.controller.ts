import { Request, Response } from "express";
import * as dormitoryService from "../../services/dormitory.service";
import { DormitoryFilterOptions } from "../../types/dormitory.types";
import { catch$ } from "../../utils/catch";
import { reply, replyPaginated, replyError } from "../../utils/response";
import { paginate } from "../../utils/pagination";

export const getAllDormitories = catch$(async (req: Request, res: Response): Promise<void> => {
  // Get validated query parameters
  const { name, campusId, priceMin, priceMax } = req.query;
  const page = Number(req.query.page || 1); // Validated by middleware
  const limit = Number(req.query.limit || 10); // Validated by middleware
  const sortBy = req.query.sortBy as string | undefined;
  const order = req.query.order as 'asc' | 'desc' | undefined;
  
  // Build filters
  const filters: DormitoryFilterOptions = {};
  if (name) filters.name = String(name);
  if (campusId) filters.campusId = Number(campusId);
  if (priceMin) filters.priceMin = Number(priceMin);
  if (priceMax) filters.priceMax = Number(priceMax);
  
  const hasFilters = Object.keys(filters).length > 0;
  
  // Get all dormitories matching filters
  const dormitories = await dormitoryService.getAllDormitories(hasFilters ? filters : undefined);
  
  // Apply pagination and sorting
  const paginatedResult = paginate(
    dormitories,
    page,
    limit,
    sortBy && order && dormitories.length > 0 ? { 
      sortBy: sortBy as keyof (typeof dormitories)[0], 
      order 
    } : undefined
  );
  
  // Send paginated response
  replyPaginated(
    res, 
    paginatedResult.items, 
    paginatedResult.total, 
    paginatedResult.page, 
    paginatedResult.limit, 
    'Dormitories retrieved successfully'
  );
});

export const getDormitoryById = catch$(async (req: Request, res: Response): Promise<void> => {
  const dormitoryId = parseInt(req.params.id);
  const dormitory = await dormitoryService.getDormitoryById(dormitoryId);
  
  reply(res, dormitory, 'Dormitory retrieved successfully');
});

export const getDormitoryAvailability = catch$(async (req: Request, res: Response): Promise<void> => {
  replyError(res, 'Not implemented yet', 501);
});

export const getDormitoryFacilities = catch$(async (req: Request, res: Response): Promise<void> => {
  replyError(res, 'Not implemented yet', 501);
});

