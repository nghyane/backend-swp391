import { Request, Response } from "express";
import * as admissionMethodService from "@/services/academic/admission-method.service";
import { catch$ } from "@/utils/catch";
import { reply, replyError } from "@/utils/response";
import {
  AdmissionMethodQueryParams,
  AdmissionMethodCreateParams,
  AdmissionMethodUpdateParams,
  AdmissionMethodAssociateParams,
  AdmissionMethodGlobalAppParams
} from "@/middlewares/validators/admission-method.validator";


export const getAllAdmissionMethods = catch$(async (req: Request, res: Response): Promise<void> => {
  // Using validated data from Zod with type inference
  const filters = req.validatedQuery as AdmissionMethodQueryParams || {};

  const hasFilters = Object.keys(filters).length > 0;

  // Get all admission methods matching filters
  const admissionMethods = await admissionMethodService.getAllAdmissionMethods(hasFilters ? filters : undefined);

  // The number of admission methods is usually small, so pagination is not needed
  reply(
    res,
    admissionMethods,
    hasFilters ? 'Filtered admission methods retrieved successfully' : 'All admission methods retrieved successfully'
  );
});

export const getAdmissionMethodById = catch$(async (req: Request, res: Response): Promise<void> => {
  // Using validated data from Zoda
  const id = req.validatedParams?.id as number;
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
  // Using validated data from Zod
  const admissionMethodId = req.validatedParams?.id as number;

  const majors = await admissionMethodService.getMajorsByAdmissionMethodId(admissionMethodId);

  const items = Array.isArray(majors) ? majors : [];
  reply(res, items, 'Majors by admission method retrieved successfully');
});

/**
 * Associate a major with an admission method
 */
export const associateMajorWithAdmissionMethod = catch$(async (req: Request, res: Response): Promise<void> => {
  // Using validated data from Zod with type inference
  const data = req.body as AdmissionMethodAssociateParams;

  const result = await admissionMethodService.associateMajorWithAdmissionMethod(
    data.admission_method_id,
    data.major_id,
    data.academic_year_id,
    data.campus_id,
    data.min_score,
    data.is_active
  );

  reply(res, result, 'Major successfully associated with admission method', 201);
});

/**
 * Create a global admission method application (for all majors)
 */
export const createGlobalAdmissionMethodApplication = catch$(async (req: Request, res: Response): Promise<void> => {
  // Using validated data from Zod with type inference
  const data = req.body as AdmissionMethodGlobalAppParams;

  const result = await admissionMethodService.createGlobalAdmissionMethodApplication(
    data.admission_method_id,
    data.academic_year_id,
    data.campus_id,
    data.note
  );

  reply(res, result, 'Global admission method application created successfully', 201);
});

/**
 * Get admission methods by major code
 * This endpoint retrieves all admission methods for a specific major identified by its code
 */
export const getAdmissionMethodsByMajor = catch$(async (req: Request, res: Response): Promise<void> => {
  // Using validated data from Zod
  const majorCode = req.validatedParams?.major_code as string;

  const admissionMethods = await admissionMethodService.getAdmissionMethodsByMajorCode(majorCode);

  reply(res, admissionMethods, 'Admission methods by major retrieved successfully');
});

export const createAdmissionMethod = catch$(async (req: Request, res: Response): Promise<void> => {
  // Using validated data from Zod with type inference
  const admissionMethodData = req.body as AdmissionMethodCreateParams;

  // Using data directly from the validated request body
  const newAdmissionMethod = await admissionMethodService.createAdmissionMethod(admissionMethodData);

  reply(res, newAdmissionMethod, 'Admission method created successfully', 201);
});

export const updateAdmissionMethod = catch$(async (req: Request, res: Response): Promise<void> => {
  // Using validated data from Zod with type inference
  const id = req.validatedParams?.id as number;
  const updateData = req.body as AdmissionMethodUpdateParams;

  // Using data directly from the validated request body
  const updatedAdmissionMethod = await admissionMethodService.updateAdmissionMethod(id, updateData);

  reply(res, updatedAdmissionMethod, 'Admission method updated successfully');
});

export const deleteAdmissionMethod = catch$(async (req: Request, res: Response): Promise<void> => {
  // Using validated data from Zod
  const id = req.validatedParams?.id as number;

  await admissionMethodService.deleteAdmissionMethod(id);
  reply(res, null, 'Admission method deleted successfully');
});



