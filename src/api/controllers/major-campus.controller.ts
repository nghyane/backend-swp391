import { Request, Response } from "express";
import * as majorCampusService from "@/services/academic/major-campus.service";
import { catch$ } from "@/utils/catch";
import { reply } from "@/utils/response";
import { MajorCampusQueryParams, MajorCampusAddParams, MajorCampusUpdateParams } from "@/middlewares/validators/major-campus.validator";

/**
 * Get all campus admissions for a major
 * This endpoint retrieves all campus admissions for a specific major
 */
export const getMajorCampusAdmissions = catch$(async (req: Request, res: Response): Promise<void> => {
  // Extract major ID from request params (already validated by middleware)
  const majorId = req.validatedParams?.major_id as number;
  
  // Extract query parameters
  const queryParams = req.validatedQuery as MajorCampusQueryParams || {};
  
  // Get campus admissions
  const campusAdmissions = await majorCampusService.getMajorCampusAdmissions(
    majorId,
    queryParams.academic_year
  );
  
  reply(res, campusAdmissions, 'Campus admissions retrieved successfully');
});

/**
 * Add a campus admission for a major
 * This endpoint adds a new campus admission for a specific major
 */
export const addMajorCampusAdmission = catch$(async (req: Request, res: Response): Promise<void> => {
  // Extract major ID from request params (already validated by middleware)
  const majorId = req.validatedParams?.major_id as number;
  
  // Extract campus admission data from request body (already validated by middleware)
  const admissionData = req.body as MajorCampusAddParams;
  
  // Add campus admission
  const newAdmission = await majorCampusService.addMajorCampusAdmission(
    majorId,
    admissionData.campus_id,
    admissionData.academic_year,
    admissionData.quota,
    admissionData.tuition_fee
  );
  
  reply(res, newAdmission, 'Campus admission added successfully', 201);
});

/**
 * Update a campus admission for a major
 * This endpoint updates an existing campus admission for a specific major
 */
export const updateMajorCampusAdmission = catch$(async (req: Request, res: Response): Promise<void> => {
  // Extract parameters from request params (already validated by middleware)
  const majorId = req.validatedParams?.major_id as number;
  const campusId = req.validatedParams?.campus_id as number;
  const academicYear = req.validatedParams?.academic_year as number;
  
  // Extract update data from request body (already validated by middleware)
  const updateData = req.body as MajorCampusUpdateParams;
  
  // Update campus admission
  const updatedAdmission = await majorCampusService.updateMajorCampusAdmission(
    majorId,
    campusId,
    academicYear,
    updateData.quota,
    updateData.tuition_fee
  );
  
  reply(res, updatedAdmission, 'Campus admission updated successfully');
});

/**
 * Delete a campus admission for a major
 * This endpoint deletes an existing campus admission for a specific major
 */
export const deleteMajorCampusAdmission = catch$(async (req: Request, res: Response): Promise<void> => {
  // Extract parameters from request params (already validated by middleware)
  const majorId = req.validatedParams?.major_id as number;
  const campusId = req.validatedParams?.campus_id as number;
  const academicYear = req.validatedParams?.academic_year as number;
  
  // Delete campus admission
  await majorCampusService.deleteMajorCampusAdmission(
    majorId,
    campusId,
    academicYear
  );
  
  reply(res, null, 'Campus admission deleted successfully');
});
