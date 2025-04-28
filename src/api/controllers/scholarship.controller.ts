import { Request, Response } from "express";
import * as scholarshipService from "../../services/scholarship.service";
import { catch$ } from "../../utils/catch";
import { reply } from "../../utils/response";
import { ScholarshipQueryParams } from "../../types/scholarship.types";


export const getAllScholarships = catch$(async (req: Request, res: Response): Promise<void> => {
  // Using validated data from Zod with type inference
  const filters = req.validatedQuery as ScholarshipQueryParams;

  const hasFilters = filters && Object.keys(filters).length > 0;

  // Get all scholarships matching filters
  const scholarships = await scholarshipService.getAllScholarships(hasFilters ? filters : undefined);

  reply(
    res,
    scholarships,
    hasFilters ? 'Filtered scholarships retrieved successfully' : 'All scholarships retrieved successfully'
  );
});


/**
 * Get scholarships by major code
 * This endpoint retrieves all scholarships for a specific major identified by its code
 */
export const getScholarshipsByMajor = catch$(async (req: Request, res: Response): Promise<void> => {
  // Using validated data from Zod
  const majorCode = req.validatedParams?.majorCode as string;

  const scholarships = await scholarshipService.getScholarshipsByMajorCode(majorCode);

  reply(res, scholarships, 'Scholarships by major retrieved successfully');
});

/**
 * Get scholarship by ID
 * This endpoint retrieves a specific scholarship by its ID
 */
export const getScholarshipById = catch$(async (req: Request, res: Response): Promise<void> => {
  // Using validated data from Zod
  const id = req.validatedParams?.id as number;
  const scholarship = await scholarshipService.getScholarshipById(id);

  reply(res, scholarship, 'Scholarship retrieved successfully');
});

/**
 * Create a new scholarship
 * This endpoint creates a new scholarship
 */
export const createScholarship = catch$(async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement the following steps:
  // 1. Extract scholarship data from request body
  // 2. Validate data (can be done with middleware)
  // 3. Call scholarshipService.createScholarship with the data
  // 4. Return the created scholarship with appropriate status code

  reply(res, { message: 'Not implemented' }, 'Scholarship creation endpoint not implemented', 501);
});

/**
 * Update an existing scholarship
 * This endpoint updates a scholarship by ID
 */
export const updateScholarship = catch$(async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement the following steps:
  // 1. Extract scholarship ID from request params
  // 2. Extract update data from request body
  // 3. Validate data (can be done with middleware)
  // 4. Call scholarshipService.updateScholarship with the ID and data
  // 5. Return the updated scholarship

  reply(res, { message: 'Not implemented' }, 'Scholarship update endpoint not implemented', 501);
});

/**
 * Delete a scholarship
 * This endpoint deletes a scholarship by ID
 */
export const deleteScholarship = catch$(async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement the following steps:
  // 1. Extract scholarship ID from request params
  // 2. Call scholarshipService.deleteScholarship with the ID
  // 3. Return success message

  reply(res, { message: 'Not implemented' }, 'Scholarship deletion endpoint not implemented', 501);
});
