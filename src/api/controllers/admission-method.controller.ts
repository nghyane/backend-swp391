import { Request, Response } from "express";
import * as admissionMethodService from "../../services/admission-method.service";
import { AdmissionMethod, AdmissionMethodFilterOptions } from "../../types/admission-method.types";
import { catch$ } from "../../utils/catch";
import { reply, replyPaginated, replyError } from "../../utils/response";
import { paginate } from "../../utils/pagination";


export const getAllAdmissionMethods = catch$(async (req: Request, res: Response): Promise<void> => {
  // Get validated query parameters
  const { name } = req.query;
  const page = Number(req.query.page || 1); // Validated by middleware
  const limit = Number(req.query.limit || 10); // Validated by middleware
  const sortBy = req.query.sortBy as string | undefined;
  const order = req.query.order as 'asc' | 'desc' | undefined;
  
  // Build filters
  const filters: AdmissionMethodFilterOptions = {};
  if (name) filters.name = String(name);
  
  const hasFilters = Object.keys(filters).length > 0;
  
  // Get all admission methods matching filters
  const admissionMethods = await admissionMethodService.getAllAdmissionMethods(hasFilters ? filters : undefined);
  
  // Apply pagination and sorting
  const paginatedResult = paginate(
    admissionMethods,
    page,
    limit,
    sortBy && order && admissionMethods.length > 0 ? { 
      sortBy: sortBy as keyof (typeof admissionMethods)[0], 
      order 
    } : undefined
  );
  
  // Send paginated response
  replyPaginated(
    res, 
    paginatedResult.items, 
    paginatedResult.total, 
    paginatedResult.page, 
    paginatedResult.limit, 
    'Admission methods retrieved successfully'
  );
});

export const getAdmissionMethodById = catch$(async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const admissionMethod = await admissionMethodService.getAdmissionMethodById(id);
  
  reply(res, admissionMethod, 'Admission method retrieved successfully');
});

export const getAdmissionMethodRequirements = catch$(async (req: Request, res: Response): Promise<void> => {
  replyError(res, 'Not implemented yet', 501);
});

/**
 * Get majors that use a specific admission method
 */
export const getMajorsByAdmissionMethod = catch$(async (req: Request, res: Response): Promise<void> => {
  const admissionMethodId = Number(req.params.id);
  
  const majors = await admissionMethodService.getMajorsByAdmissionMethodId(admissionMethodId);
  
  const items = Array.isArray(majors) ? majors : [];
  reply(res, items, 'Majors by admission method retrieved successfully');
});

/**
 * Associate a major with an admission method
 */
export const associateMajorWithAdmissionMethod = catch$(async (req: Request, res: Response): Promise<void> => {
  const { majorId, admissionMethodId, academicYearId, campusId, minScore, note } = req.body;
  
  if (!majorId || !admissionMethodId || !academicYearId) {
    replyError(res, 'Missing required fields', 400, 'body', 'majorId, admissionMethodId, and academicYearId are required');
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
  
  reply(res, result, 'Major successfully associated with admission method', 201);
});

/**
 * Create a global admission method application (for all majors)
 */
export const createGlobalAdmissionMethodApplication = catch$(async (req: Request, res: Response): Promise<void> => {
  const { admissionMethodId, academicYearId, campusId, note } = req.body;
  
  if (!admissionMethodId || !academicYearId) {
    replyError(res, 'Missing required fields', 400, 'body', 'admissionMethodId and academicYearId are required');
    return;
  }
  
  const result = await admissionMethodService.createGlobalAdmissionMethodApplication(
    Number(admissionMethodId),
    Number(academicYearId),
    campusId ? Number(campusId) : undefined,
    note
  );
  
  reply(res, result, 'Global admission method application created successfully', 201);
});

/**
 * Get admission methods by major code
 * This endpoint retrieves all admission methods for a specific major identified by its code
 */
export const getAdmissionMethodsByMajor = catch$(async (req: Request, res: Response): Promise<void> => {
  const majorCode = req.params.majorCode;
  
  const admissionMethods = await admissionMethodService.getAdmissionMethodsByMajorCode(majorCode);
  
  reply(res, admissionMethods, 'Admission methods by major retrieved successfully');
});

export const createAdmissionMethod = catch$(async (req: Request, res: Response): Promise<void> => {
  const admissionMethodData: Omit<AdmissionMethod, 'id'> = req.body;
  
  const newAdmissionMethod = await admissionMethodService.createAdmissionMethod(admissionMethodData);
  reply(res, newAdmissionMethod, 'Admission method created successfully', 201);
});

export const updateAdmissionMethod = catch$(async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  const updateData: Partial<Omit<AdmissionMethod, 'id'>> = req.body;
  
  const updatedAdmissionMethod = await admissionMethodService.updateAdmissionMethod(id, updateData);
  reply(res, updatedAdmissionMethod, 'Admission method updated successfully');
});

export const deleteAdmissionMethod = catch$(async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  
  await admissionMethodService.deleteAdmissionMethod(id);
  reply(res, null, 'Admission method deleted successfully');
});



