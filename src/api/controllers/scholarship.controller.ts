import { Request, Response } from "express";
import * as scholarshipService from "../../services/scholarship.service";
import { ScholarshipFilterOptions } from "../../types/scholarship.types";
import { catch$ } from "../../utils/catch";
import { reply, replyPaginated } from "../../utils/response";
import { paginate } from "../../utils/pagination";


export const getAllScholarships = catch$(async (req: Request, res: Response): Promise<void> => {
  // Get validated query parameters
  const { name, majorId, campusId, minAmount } = req.query;
  const page = Number(req.query.page || 1); // Validated by middleware
  const limit = Number(req.query.limit || 10); // Validated by middleware
  const sortBy = req.query.sortBy as string | undefined;
  const order = req.query.order as 'asc' | 'desc' | undefined;
  
  // Build filters
  const filters: ScholarshipFilterOptions = {};
  if (name) filters.name = String(name);
  if (majorId) filters.majorId = Number(majorId);
  if (campusId) filters.campusId = Number(campusId);
  if (minAmount) filters.minAmount = Number(minAmount);
  
  const hasFilters = Object.keys(filters).length > 0;
  
  // Get all scholarships matching filters
  const scholarships = await scholarshipService.getAllScholarships(hasFilters ? filters : undefined);
  
  // Apply pagination and sorting
  const paginatedResult = paginate(
    scholarships,
    page,
    limit,
    sortBy && order && scholarships.length > 0 ? { 
      sortBy: sortBy as keyof (typeof scholarships)[0], 
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
    'Scholarships retrieved successfully'
  );
});


/**
 * Get scholarships by major code
 * This endpoint retrieves all scholarships for a specific major identified by its code
 */
export const getScholarshipsByMajor = catch$(async (req: Request, res: Response): Promise<void> => {
  const majorCode = req.params.majorCode;
  
  const scholarships = await scholarshipService.getScholarshipsByMajorCode(majorCode);
  
  reply(res, scholarships, 'Scholarships by major retrieved successfully');
});


