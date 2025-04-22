import { Request, Response } from "express";
import * as admissionMethodService from "../../services/admission-method.service";
import { AdmissionMethod, AdmissionMethodFilterOptions } from "../../types/admission-method.types";
import { catch$ } from "../../utils/catch";


export const getAllAdmissionMethods = catch$(async (req: Request, res: Response): Promise<void> => {
  const { name } = req.query;
  
  const filters: AdmissionMethodFilterOptions = {};
  
  if (name) filters.name = String(name);
  
  const hasFilters = Object.keys(filters).length > 0;
  const admissionMethods = await admissionMethodService.getAllAdmissionMethods(hasFilters ? filters : undefined);
  
  res.json({
    success: true,
    data: admissionMethods,
    count: admissionMethods.length,
    filters: hasFilters ? filters : undefined
  });
});

export const getAdmissionMethodById = catch$(async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const admissionMethod = await admissionMethodService.getAdmissionMethodById(id);
  
  res.json({
    success: true,
    data: admissionMethod
  });
});

export const getAdmissionMethodRequirements = catch$(async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({
    success: false,
    message: "Not implemented yet"
  });
});

/**
 * Get majors that use a specific admission method
 */
export const getMajorsByAdmissionMethod = catch$(async (req: Request, res: Response): Promise<void> => {
  const admissionMethodId = Number(req.params.id);
  
  const majors = await admissionMethodService.getMajorsByAdmissionMethodId(admissionMethodId);
  
  res.json({
    success: true,
    data: majors,
    count: Array.isArray(majors) ? majors.length : 0
  });
});

/**
 * Associate a major with an admission method
 */
export const associateMajorWithAdmissionMethod = catch$(async (req: Request, res: Response): Promise<void> => {
  const { majorId, admissionMethodId, academicYearId, campusId, minScore, note } = req.body;
  
  if (!majorId || !admissionMethodId || !academicYearId) {
    res.status(400).json({
      success: false,
      message: "Missing required fields: majorId, admissionMethodId, and academicYearId are required"
    });
    return;
  }
  
  const result = await admissionMethodService.associateMajorWithAdmissionMethod(
    Number(majorId),
    Number(admissionMethodId),
    Number(academicYearId),
    campusId ? Number(campusId) : undefined,
    minScore ? Number(minScore) : undefined,
    note
  );
  
  res.status(201).json({
    success: true,
    data: result,
    message: "Major successfully associated with admission method"
  });
});

/**
 * Create a global admission method application (for all majors)
 */
export const createGlobalAdmissionMethodApplication = catch$(async (req: Request, res: Response): Promise<void> => {
  const { admissionMethodId, academicYearId, campusId, note } = req.body;
  
  if (!admissionMethodId || !academicYearId) {
    res.status(400).json({
      success: false,
      message: "Missing required fields: admissionMethodId and academicYearId are required"
    });
    return;
  }
  
  const result = await admissionMethodService.createGlobalAdmissionMethodApplication(
    Number(admissionMethodId),
    Number(academicYearId),
    campusId ? Number(campusId) : undefined,
    note
  );
  
  res.status(201).json({
    success: true,
    data: result,
    message: "Global admission method application created successfully"
  });
});

/**
 * Get admission methods by major code
 * This endpoint retrieves all admission methods for a specific major identified by its code
 */
export const getAdmissionMethodsByMajor = catch$(async (req: Request, res: Response): Promise<void> => {
  const majorCode = req.params.majorCode;
  
  const admissionMethods = await admissionMethodService.getAdmissionMethodsByMajorCode(majorCode);
  
  res.json({
    success: true,
    data: admissionMethods,
    count: admissionMethods.length
  });
});

export const createAdmissionMethod = catch$(async (req: Request, res: Response): Promise<void> => {
  const admissionMethodData: Omit<AdmissionMethod, 'id'> = req.body;
  
  const newAdmissionMethod = await admissionMethodService.createAdmissionMethod(admissionMethodData);
  res.status(201).json({
    success: true,
    data: newAdmissionMethod,
    message: 'Admission method created successfully'
  });
});

export const updateAdmissionMethod = catch$(async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  const updateData: Partial<Omit<AdmissionMethod, 'id'>> = req.body;
  
  const updatedAdmissionMethod = await admissionMethodService.updateAdmissionMethod(id, updateData);
  res.status(200).json({
    success: true,
    data: updatedAdmissionMethod,
    message: 'Admission method updated successfully'
  });
});

export const deleteAdmissionMethod = catch$(async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  
  await admissionMethodService.deleteAdmissionMethod(id);
  res.status(200).json({
    success: true,
    message: 'Admission method deleted successfully'
  });
});



