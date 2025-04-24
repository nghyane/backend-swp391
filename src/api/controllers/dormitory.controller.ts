import { Request, Response } from "express";
import * as dormitoryService from "../../services/dormitory.service";
import { catch$ } from "../../utils/catch";
import { reply, replyError } from "../../utils/response";
import { DormitoryQueryParams } from "../../types/dormitory.types";

export const getAllDormitories = catch$(async (req: Request, res: Response): Promise<void> => {
  // Sử dụng dữ liệu đã validate từ Zod với type inference
  const filters = req.validatedQuery as DormitoryQueryParams || {};
  
  const hasFilters = Object.keys(filters).length > 0;
  
  // Get all dormitories matching filters
  const dormitories = await dormitoryService.getAllDormitories(hasFilters ? filters : undefined);
  
  // Số lượng ký túc xá thường ít nên không cần phân trang
  reply(
    res, 
    dormitories, 
    hasFilters ? 'Filtered dormitories retrieved successfully' : 'All dormitories retrieved successfully'
  );
});

export const getDormitoryById = catch$(async (req: Request, res: Response): Promise<void> => {
  // Sử dụng dữ liệu đã validate từ Zod
  const dormitoryId = req.validatedParams?.id as number;
  const dormitory = await dormitoryService.getDormitoryById(dormitoryId);
  
  reply(res, dormitory, 'Dormitory retrieved successfully');
});

export const getDormitoryAvailability = catch$(async (req: Request, res: Response): Promise<void> => {
  replyError(res, 'Not implemented yet', 501);
});

export const getDormitoryFacilities = catch$(async (req: Request, res: Response): Promise<void> => {
  replyError(res, 'Not implemented yet', 501);
});

/**
 * Create a new dormitory
 * This endpoint creates a new dormitory
 */
export const createDormitory = catch$(async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement the following steps:
  // 1. Extract dormitory data from request body (already validated by middleware)
  // 2. Call dormitoryService.createDormitory with the data
  // 3. Return the created dormitory with appropriate status code
  
  reply(res, { message: 'Not implemented' }, 'Dormitory creation endpoint not implemented', 501);
});

/**
 * Update an existing dormitory
 * This endpoint updates a dormitory by ID
 */
export const updateDormitory = catch$(async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement the following steps:
  // 1. Extract dormitory ID from request params (already validated by middleware)
  // 2. Extract update data from request body (already validated by middleware)
  // 3. Call dormitoryService.updateDormitory with the ID and data
  // 4. Return the updated dormitory
  
  reply(res, { message: 'Not implemented' }, 'Dormitory update endpoint not implemented', 501);
});

/**
 * Delete a dormitory
 * This endpoint deletes a dormitory by ID
 */
export const deleteDormitory = catch$(async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement the following steps:
  // 1. Extract dormitory ID from request params
  // 2. Call dormitoryService.deleteDormitory with the ID
  // 3. Return success message
  
  reply(res, { message: 'Not implemented' }, 'Dormitory deletion endpoint not implemented', 501);
});
