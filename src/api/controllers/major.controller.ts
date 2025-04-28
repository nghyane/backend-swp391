import { Request, Response } from "express";
import * as majorService from "../../services/major.service";
import { catch$ } from "../../utils/catch";
import { reply } from "../../utils/response";
import { MajorQueryParams } from "../../middlewares/validators/major.validator";

export const getAllMajors = catch$(async (req: Request, res: Response): Promise<void> => {
  // Using validated data from Zod with type inference
  const filters = req.validatedQuery as MajorQueryParams || {};

  // Set default academic year to current year if not specified
  if (!filters.academic_year) {
    const currentYear = new Date().getFullYear();
    // Get current academic year (academic year 2024-2025 has id 2024)
    filters.academic_year = currentYear;
  }

  const hasFilters = Object.keys(filters).length > 0;

  // Get all majors matching filters
  const majors = await majorService.getAllMajors(filters);

  // The number of majors when filtered by academic year is usually not large, so pagination is not needed
  reply(
    res,
    majors,
    hasFilters ? 'Filtered majors retrieved successfully' : 'All majors retrieved successfully'
  );
});

/**
 * Get major details by code
 * This endpoint retrieves a major by its unique code
 */
export const getMajorByCode = catch$(async (req: Request, res: Response): Promise<void> => {
  // Check and get the major code from validated params
  if (!req.validatedParams?.majorCode) {
    throw new Error('Major code is required');
  }

  const code = req.validatedParams.majorCode as string;
  const queryParams = req.validatedQuery as MajorQueryParams || {};

  // Use current year if no academic year is specified
  const academicYear = queryParams.academic_year || new Date().getFullYear();

  // Get major information with academic year filter
  const major = await majorService.getMajorByCode(code, academicYear);

  reply(res, major, 'Major retrieved successfully');
});



export const getMajorsByCampus = catch$(async (req: Request, res: Response): Promise<void> => {
  // Using validated data from Zod with type inference
  const campusId = req.validatedParams?.campusId as number;
  const { academic_year } = req.validatedQuery as MajorQueryParams;

  // Set default academic year to current year if not specified
  const currentAcademicYear = academic_year || new Date().getFullYear();

  // Get majors by campus with academic year filter
  const majors = await majorService.getMajorsByCampusId(campusId, currentAcademicYear);

  reply(res, majors, 'Majors by campus retrieved successfully');
});

/**
 * Create a new major
 * This endpoint creates a new major
 */
export const createMajor = catch$(async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement the following steps:
  // 1. Extract major data from request body (already validated by middleware)
  // 2. Call majorService.createMajor with the data
  // 3. Return the created major with appropriate status code

  reply(res, { message: 'Not implemented' }, 'Major creation endpoint not implemented', 501);
});

/**
 * Update an existing major
 * This endpoint updates a major by ID
 */
export const updateMajor = catch$(async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement the following steps:
  // 1. Extract major ID from request params (already validated by middleware)
  // 2. Extract update data from request body (already validated by middleware)
  // 3. Call majorService.updateMajor with the ID and data
  // 4. Return the updated major

  reply(res, { message: 'Not implemented' }, 'Major update endpoint not implemented', 501);
});

/**
 * Delete a major
 * This endpoint deletes a major by ID
 */
export const deleteMajor = catch$(async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement the following steps:
  // 1. Extract major ID from request params
  // 2. Call majorService.deleteMajor with the ID
  // 3. Return success message

  reply(res, { message: 'Not implemented' }, 'Major deletion endpoint not implemented', 501);
});
