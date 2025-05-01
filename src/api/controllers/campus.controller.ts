import { Request, Response } from "express";
import * as campusService from "@/services/campus/campus.service";
import { Campus, CampusQueryParams, CampusCreateParams, CampusUpdateParams } from "@/types/campus.types";
import { catch$ } from "@/utils/catch";
import { reply, replyError } from "@/utils/response";

export const getAllCampuses = catch$(async (req: Request, res: Response): Promise<void> => {
  // Using validated data from Zod with type inference
  const filters = req.validatedQuery as CampusQueryParams;

  const hasFilters = filters && Object.keys(filters).length > 0;

  // Get all campuses matching filters
  const campuses = await campusService.getAllCampuses(hasFilters ? filters : undefined);

  // The number of campuses is usually small, so pagination is not needed
  reply(
    res,
    campuses,
    hasFilters ? 'Filtered campuses retrieved successfully' : 'All campuses retrieved successfully'
  );
});

export const getCampusById = catch$(async (req: Request, res: Response): Promise<void> => {
  // Using validated data from Zod
  const id = req.validatedParams?.id as number;
  const campus = await campusService.getCampusById(id);
  reply(res, campus, 'Campus retrieved successfully');
});

/**
 * Create a new campus
 * This endpoint creates a new campus
 */
export const createCampus = catch$(async (req: Request, res: Response): Promise<void> => {
  // Extract campus data from request body (already validated by middleware)
  const campusData = req.body as CampusCreateParams;

  // Call service to create campus
  const newCampus = await campusService.createCampus(campusData);

  // Return the created campus with 201 Created status
  reply(res, newCampus, 'Campus created successfully', 201);
});

/**
 * Update an existing campus
 * This endpoint updates a campus by ID
 */
export const updateCampus = catch$(async (req: Request, res: Response): Promise<void> => {
  // Extract campus ID from request params (already validated by middleware)
  const id = req.validatedParams?.id as number;

  // Extract update data from request body (already validated by middleware)
  const updateData = req.body as CampusUpdateParams;

  // Call service to update campus
  const updatedCampus = await campusService.updateCampus(id, updateData);

  // Return the updated campus
  reply(res, updatedCampus, 'Campus updated successfully');
});

/**
 * Delete a campus
 * This endpoint deletes a campus by ID
 */
export const deleteCampus = catch$(async (req: Request, res: Response): Promise<void> => {
  // Extract campus ID from request params (already validated by middleware)
  const id = req.validatedParams?.id as number;

  // Call service to delete campus
  await campusService.deleteCampus(id);

  // Return success message with 200 OK status
  reply(res, null, 'Campus deleted successfully');
});

/**
 * Get majors offered at a specific campus
 * This endpoint retrieves all majors available at a campus with optional academic year filter
 */
export const getCampusMajors = catch$(async (req: Request, res: Response): Promise<void> => {
  // Extract campus ID from request params (already validated by middleware)
  const campusId = req.validatedParams?.id as number;

  // Extract optional academic year from query params
  const academicYear = req.query.academic_year ? parseInt(req.query.academic_year as string) : undefined;

  // Call service to get majors for this campus
  const majors = await campusService.getCampusMajors(campusId, academicYear);

  // Return the majors
  reply(
    res,
    majors,
    academicYear
      ? `Majors for campus ID ${campusId} in academic year ${academicYear} retrieved successfully`
      : `All majors for campus ID ${campusId} retrieved successfully`
  );
});




