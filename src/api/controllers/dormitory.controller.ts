import { Request, Response } from "express";
import * as dormitoryService from "@/services/campus/dormitory.service";
import { catch$ } from "@/utils/catch";
import { reply, replyError } from "@/utils/response";
import { DormitoryQueryParams, DormitoryCreateParams, DormitoryUpdateParams } from "@/types/dormitory.types";

export const getAllDormitories = catch$(async (req: Request, res: Response): Promise<void> => {
  // Using validated data from Zod with type inference
  const filters = req.validatedQuery as DormitoryQueryParams || {};

  const hasFilters = Object.keys(filters).length > 0;

  // Get all dormitories matching filters
  const dormitories = await dormitoryService.getAllDormitories(hasFilters ? filters : undefined);

  // The number of dormitories is usually small, so pagination is not needed
  reply(
    res,
    dormitories,
    hasFilters ? 'Filtered dormitories retrieved successfully' : 'All dormitories retrieved successfully'
  );
});

export const getDormitoryById = catch$(async (req: Request, res: Response): Promise<void> => {
  // Using validated data from Zod
  const dormitoryId = req.validatedParams?.id as number;
  const dormitory = await dormitoryService.getDormitoryById(dormitoryId);

  reply(res, dormitory, 'Dormitory retrieved successfully');
});

/**
 * Create a new dormitory
 * This endpoint creates a new dormitory
 */
export const createDormitory = catch$(async (req: Request, res: Response): Promise<void> => {
  // Extract dormitory data from request body (already validated by middleware)
  const dormitoryData = req.body as DormitoryCreateParams;

  // Call service to create dormitory
  const newDormitory = await dormitoryService.createDormitory(dormitoryData);

  // Return the created dormitory with 201 Created status
  reply(res, newDormitory, 'Dormitory created successfully', 201);
});

/**
 * Update an existing dormitory
 * This endpoint updates a dormitory by ID
 */
export const updateDormitory = catch$(async (req: Request, res: Response): Promise<void> => {
  // Extract dormitory ID from request params (already validated by middleware)
  const id = req.validatedParams?.id as number;

  // Extract update data from request body (already validated by middleware)
  const updateData = req.body as DormitoryUpdateParams;

  // Call service to update dormitory
  const updatedDormitory = await dormitoryService.updateDormitory(id, updateData);

  // Return the updated dormitory
  reply(res, updatedDormitory, 'Dormitory updated successfully');
});

/**
 * Delete a dormitory
 * This endpoint deletes a dormitory by ID
 */
export const deleteDormitory = catch$(async (req: Request, res: Response): Promise<void> => {
  // Extract dormitory ID from request params (already validated by middleware)
  const id = req.validatedParams?.id as number;

  // Call service to delete dormitory
  await dormitoryService.deleteDormitory(id);

  // Return success message with 200 OK status
  reply(res, null, 'Dormitory deleted successfully');
});
