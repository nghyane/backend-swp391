import { Request, Response } from "express";
import * as majorService from "../../services/major.service";
import { MajorFilterOptions } from "../../types/major.types";
import { catch$ } from "../../utils/catch";
import { reply, replyPaginated } from "../../utils/response";
import { paginate } from "../../utils/pagination";

export const getAllMajors = catch$(async (req: Request, res: Response): Promise<void> => {
  // Get validated query parameters
  const { name, code, description } = req.query;
  const page = Number(req.query.page || 1); // Validated by middleware
  const limit = Number(req.query.limit || 10); // Validated by middleware
  const sortBy = req.query.sortBy as string | undefined;
  const order = req.query.order as 'asc' | 'desc' | undefined;
  
  // Build filters
  const filters: MajorFilterOptions = {};
  if (name) filters.name = String(name);
  if (code) filters.code = String(code);
  if (description) filters.description = String(description);
  
  const hasFilters = Object.keys(filters).length > 0;
  
  // Get all majors matching filters
  const majors = await majorService.getAllMajors(hasFilters ? filters : undefined);
  
  // Apply pagination and sorting
  const paginatedResult = paginate(
    majors,
    page,
    limit,
    sortBy && order && majors.length > 0 ? { 
      sortBy: sortBy as keyof (typeof majors)[0], 
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
    'Majors retrieved successfully'
  );
});

/**
 * Get major details by code
 * This endpoint retrieves a major by its unique code
 */
export const getMajorByCode = catch$(async (req: Request, res: Response): Promise<void> => {
  const code = req.params.code;
  const major = await majorService.getMajorByCode(code);
  
  reply(res, major, 'Major retrieved successfully');
});



export const getMajorsByCampus = catch$(async (req: Request, res: Response): Promise<void> => {
  const campusId = Number(req.params.campusId);
  
  const majors = await majorService.getMajorsByCampusId(campusId);
  
  reply(res, majors, 'Majors by campus retrieved successfully');
});
