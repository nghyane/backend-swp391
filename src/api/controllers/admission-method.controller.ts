import { Request, Response } from "express";
import * as admissionMethodService from "../../services/admission-method.service";
import { catch$ } from "../../utils/catch";
import { reply, replyError } from "../../utils/response";
import {
  AdmissionMethodQueryParams,
  AdmissionMethodCreateParams,
  AdmissionMethodUpdateParams,
  AdmissionMethodAssociateParams,
  AdmissionMethodGlobalAppParams
} from "../../middlewares/validators/admission-method.validator";


export const getAllAdmissionMethods = catch$(async (req: Request, res: Response): Promise<void> => {
  // Sử dụng dữ liệu đã validate từ Zod với type inference
  const filters = req.validatedQuery as AdmissionMethodQueryParams || {};

  const hasFilters = Object.keys(filters).length > 0;

  // Get all admission methods matching filters
  const admissionMethods = await admissionMethodService.getAllAdmissionMethods(hasFilters ? filters : undefined);

  // Số lượng phương thức xét tuyển thường ít nên không cần phân trang
  reply(
    res,
    admissionMethods,
    hasFilters ? 'Filtered admission methods retrieved successfully' : 'All admission methods retrieved successfully'
  );
});

export const getAdmissionMethodById = catch$(async (req: Request, res: Response): Promise<void> => {
  // Sử dụng dữ liệu đã validate từ Zod
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
  // Sử dụng dữ liệu đã validate từ Zod
  const admissionMethodId = req.validatedParams?.id as number;

  const majors = await admissionMethodService.getMajorsByAdmissionMethodId(admissionMethodId);

  const items = Array.isArray(majors) ? majors : [];
  reply(res, items, 'Majors by admission method retrieved successfully');
});

/**
 * Associate a major with an admission method
 */
export const associateMajorWithAdmissionMethod = catch$(async (req: Request, res: Response): Promise<void> => {
  // Sử dụng dữ liệu đã validate từ Zod với type inference
  const data = req.body as AdmissionMethodAssociateParams;

  const result = await admissionMethodService.associateMajorWithAdmissionMethod(
    data.admissionMethodId,
    data.majorId,
    data.academicYearId,
    data.campusId,
    data.minScore,
    data.isActive
  );

  reply(res, result, 'Major successfully associated with admission method', 201);
});

/**
 * Create a global admission method application (for all majors)
 */
export const createGlobalAdmissionMethodApplication = catch$(async (req: Request, res: Response): Promise<void> => {
  // Sử dụng dữ liệu đã validate từ Zod với type inference
  const data = req.body as AdmissionMethodGlobalAppParams;

  const result = await admissionMethodService.createGlobalAdmissionMethodApplication(
    data.admissionMethodId,
    data.academicYearId,
    data.campusId,
    data.note
  );

  reply(res, result, 'Global admission method application created successfully', 201);
});

/**
 * Get admission methods by major code
 * This endpoint retrieves all admission methods for a specific major identified by its code
 */
export const getAdmissionMethodsByMajor = catch$(async (req: Request, res: Response): Promise<void> => {
  // Sử dụng dữ liệu đã validate từ Zod
  const majorCode = req.validatedParams?.majorCode as string;

  const admissionMethods = await admissionMethodService.getAdmissionMethodsByMajorCode(majorCode);

  reply(res, admissionMethods, 'Admission methods by major retrieved successfully');
});

export const createAdmissionMethod = catch$(async (req: Request, res: Response): Promise<void> => {
  // Sử dụng dữ liệu đã validate từ Zod với type inference
  const admissionMethodData = req.body as AdmissionMethodCreateParams;

  // Sử dụng trực tiếp dữ liệu từ request body đã được validate
  const newAdmissionMethod = await admissionMethodService.createAdmissionMethod(admissionMethodData);

  reply(res, newAdmissionMethod, 'Admission method created successfully', 201);
});

export const updateAdmissionMethod = catch$(async (req: Request, res: Response): Promise<void> => {
  // Sử dụng dữ liệu đã validate từ Zod với type inference
  const id = req.validatedParams?.id as number;
  const updateData = req.body as AdmissionMethodUpdateParams;

  // Sử dụng trực tiếp dữ liệu từ request body đã được validate
  const updatedAdmissionMethod = await admissionMethodService.updateAdmissionMethod(id, updateData);

  reply(res, updatedAdmissionMethod, 'Admission method updated successfully');
});

export const deleteAdmissionMethod = catch$(async (req: Request, res: Response): Promise<void> => {
  // Sử dụng dữ liệu đã validate từ Zod
  const id = req.validatedParams?.id as number;

  await admissionMethodService.deleteAdmissionMethod(id);
  reply(res, null, 'Admission method deleted successfully');
});



