import { Request, Response } from "express";
import * as campusService from "../../services/campus.service";
import { Campus, CampusQueryParams } from "../../types/campus.types";
import { catch$ } from "../../utils/catch";
import { reply, replyError } from "../../utils/response";

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
  // TODO: Implement the following steps:
  // 1. Extract campus data from request body (already validated by middleware)
  // 2. Call campusService.createCampus with the data
  // 3. Return the created campus with appropriate status code

  reply(res, { message: 'Not implemented' }, 'Campus creation endpoint not implemented', 501);
});

/**
 * Update an existing campus
 * This endpoint updates a campus by ID
 */
export const updateCampus = catch$(async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement the following steps:
  // 1. Extract campus ID from request params (already validated by middleware)
  // 2. Extract update data from request body (already validated by middleware)
  // 3. Call campusService.updateCampus with the ID and data
  // 4. Return the updated campus

  reply(res, { message: 'Not implemented' }, 'Campus update endpoint not implemented', 501);
});

/**
 * Delete a campus
 * This endpoint deletes a campus by ID
 */
export const deleteCampus = catch$(async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement the following steps:
  // 1. Extract campus ID from request params
  // 2. Call campusService.deleteCampus with the ID
  // 3. Return success message

  reply(res, { message: 'Not implemented' }, 'Campus deletion endpoint not implemented', 501);
});

export const getCampusMajors = catch$(async (req: Request, res: Response): Promise<void> => {

  replyError(res, 'Not implemented yet', 501);
});




