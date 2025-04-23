import { Request, Response } from "express";
import * as campusService from "../../services/campus.service";
import { Campus, CampusFilterOptions } from "../../types/campus.types";
import { catch$ } from "../../utils/catch";
import { reply, replyPaginated, replyError } from "../../utils/response";
import { paginate } from "../../utils/pagination";

export const getAllCampuses = catch$(async (req: Request, res: Response): Promise<void> => {
  // Get validated query parameters
  const { name, address } = req.query;
  const page = Number(req.query.page || 1); // Validated by middleware
  const limit = Number(req.query.limit || 10); // Validated by middleware
  const sortBy = req.query.sortBy as string | undefined;
  const order = req.query.order as 'asc' | 'desc' | undefined;
  
  // Build filters
  const filters: CampusFilterOptions = {};
  if (name) filters.name = String(name);
  if (address) filters.address = String(address);
  
  const hasFilters = Object.keys(filters).length > 0;
  
  // Get all campuses matching filters
  const campuses = await campusService.getAllCampuses(hasFilters ? filters : undefined);
  
  // Apply pagination and sorting
  const paginatedResult = paginate(
    campuses,
    page,
    limit,
    sortBy && order && campuses.length > 0 ? { 
      sortBy: sortBy as keyof (typeof campuses)[0], 
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
    'Campuses retrieved successfully'
  );
});

export const getCampusById = catch$(async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const campus = await campusService.getCampusById(id);
  reply(res, campus, 'Campus retrieved successfully');
});

export const createCampus = catch$(async (req: Request, res: Response): Promise<void> => {
  const campusData: Omit<Campus, 'id'> = req.body;
  const newCampus = await campusService.createCampus(campusData);
  reply(res, newCampus, 'Campus created successfully', 201);
});

export const updateCampus = catch$(async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const updateData: Partial<Omit<Campus, 'id'>> = req.body;
  
  const updatedCampus = await campusService.updateCampus(id, updateData);
  reply(res, updatedCampus, 'Campus updated successfully');
});

export const deleteCampus = catch$(async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  
  await campusService.deleteCampus(id);
  reply(res, null, 'Campus deleted successfully');
});

export const getCampusMajors = catch$(async (req: Request, res: Response): Promise<void> => {

  replyError(res, 'Not implemented yet', 501);
});

export const getCampusFacilities = catch$(async (req: Request, res: Response): Promise<void> => {

  replyError(res, 'Not implemented yet', 501);
});



