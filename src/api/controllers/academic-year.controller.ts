import { Request, Response } from "express";
import * as academicYearService from "@/services/academic/academic-year.service";
import { catch$ } from "@/utils/catch";
import { reply } from "@/utils/response";
import { AcademicYearCreateParams } from "@/middlewares/validators/academic-year.validator";

/**
 * Get all academic years
 * This endpoint retrieves all academic years
 */
export const getAllAcademicYears = catch$(async (req: Request, res: Response): Promise<void> => {
  const academicYears = await academicYearService.getAllAcademicYears();
  reply(res, academicYears, 'Academic years retrieved successfully');
});

/**
 * Get academic year by ID
 * This endpoint retrieves an academic year by its ID
 */
export const getAcademicYearById = catch$(async (req: Request, res: Response): Promise<void> => {
  const id = req.validatedParams?.id as number;
  const academicYear = await academicYearService.getAcademicYearById(id);
  reply(res, academicYear, 'Academic year retrieved successfully');
});

/**
 * Get current academic year
 * This endpoint retrieves the current academic year
 */
export const getCurrentAcademicYear = catch$(async (req: Request, res: Response): Promise<void> => {
  const academicYear = await academicYearService.getCurrentAcademicYear();
  reply(res, academicYear, 'Current academic year retrieved successfully');
});

/**
 * Create a new academic year
 * This endpoint creates a new academic year
 */
export const createAcademicYear = catch$(async (req: Request, res: Response): Promise<void> => {
  const data = req.body as AcademicYearCreateParams;
  const academicYear = await academicYearService.createAcademicYear(data.year);
  reply(res, academicYear, 'Academic year created successfully', 201);
});

/**
 * Delete an academic year
 * This endpoint deletes an academic year
 */
export const deleteAcademicYear = catch$(async (req: Request, res: Response): Promise<void> => {
  const id = req.validatedParams?.id as number;
  await academicYearService.deleteAcademicYear(id);
  reply(res, null, 'Academic year deleted successfully');
});
