import { Request, Response } from "express";
import * as scholarshipService from "@/services/academic/scholarship.service";
import { catch$ } from "@/utils/catch";
import { reply } from "@/utils/response";
import { ScholarshipQueryParams, ScholarshipCreateParams, ScholarshipUpdateParams } from "@/types/scholarship.types";


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
  // Extract scholarship data from request body (already validated by middleware)
  const scholarshipData = req.body as ScholarshipCreateParams;

  // Call service to create scholarship
  const newScholarship = await scholarshipService.createScholarship(scholarshipData);

  // Return the created scholarship with 201 Created status
  reply(res, newScholarship, 'Scholarship created successfully', 201);
});

/**
 * Update an existing scholarship
 * This endpoint updates a scholarship by ID
 */
export const updateScholarship = catch$(async (req: Request, res: Response): Promise<void> => {
  // Extract scholarship ID from request params (already validated by middleware)
  const id = req.validatedParams?.id as number;

  // Extract update data from request body (already validated by middleware)
  const updateData = req.body as ScholarshipUpdateParams;

  // Call service to update scholarship
  const updatedScholarship = await scholarshipService.updateScholarship(id, updateData);

  // Return the updated scholarship
  reply(res, updatedScholarship, 'Scholarship updated successfully');
});

/**
 * Delete a scholarship
 * This endpoint deletes a scholarship by ID
 */
export const deleteScholarship = catch$(async (req: Request, res: Response): Promise<void> => {
  // Extract scholarship ID from request params (already validated by middleware)
  const id = req.validatedParams?.id as number;

  // Call service to delete scholarship
  await scholarshipService.deleteScholarship(id);

  // Return success message with 200 OK status
  reply(res, null, 'Scholarship deleted successfully');
});
