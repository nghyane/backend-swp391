import { eq, ilike, and, SQL } from 'drizzle-orm';
import { db } from '../db';
import { admissionMethods, majors, admissionMethodApplications } from '../db/schema';
import { AdmissionMethodQueryParams } from '../middlewares/validators/admission-method.validator';
import { NotFoundError } from '../utils/errors';

// Sử dụng type inference từ Drizzle ORM schema
type AdmissionMethod = typeof admissionMethods.$inferSelect;
type AdmissionMethodApplication = typeof admissionMethodApplications.$inferSelect;
type Major = typeof majors.$inferSelect;

const DEFAULT_QUERY_OPTIONS = {
  orderBy: admissionMethods.name
};

export const getAllAdmissionMethods = async (filters?: AdmissionMethodQueryParams) => {
  if (!filters || Object.keys(filters).length === 0) {
    return await db.query.admissionMethods.findMany(DEFAULT_QUERY_OPTIONS);
  }
  
  const conditions: SQL[] = [
    filters.name && ilike(admissionMethods.name, `%${filters.name}%`)
  ].filter(Boolean) as SQL[];
  
  if (conditions.length === 0) {
    return await db.query.admissionMethods.findMany(DEFAULT_QUERY_OPTIONS);
  }
  
  return await db.query.admissionMethods.findMany({
    ...DEFAULT_QUERY_OPTIONS,
    where: and(...conditions)
  });
};

export const getAdmissionMethodById = async (id: number) => {
  const result = await db.query.admissionMethods.findFirst({
    where: eq(admissionMethods.id, id)
  });
  if (!result) throw new NotFoundError('AdmissionMethod', id);
  return result;
};

/**
 * Create a new admission method
 * @param data Admission method data without id
 * @returns Created admission method
 */
export const createAdmissionMethod = async (data: { name: string; description?: string; application_url?: string }) => {
  // TODO: Implement this function
  throw new Error('Not implemented');
};

/**
 * Update an existing admission method
 * @param id Admission method ID
 * @param data Updated admission method data
 * @returns Updated admission method
 */
export const updateAdmissionMethod = async (id: number, data: { name?: string; description?: string; application_url?: string }) => {
  // TODO: Implement this function
  throw new Error('Not implemented');
};

/**
 * Delete an admission method
 * @param id Admission method ID
 */
export const deleteAdmissionMethod = async (id: number): Promise<void> => {
  // TODO: Implement this function
  throw new Error('Not implemented');
};

export const getAdmissionMethodsByMajorId = async (majorId: number) => {
  // Check if major exists
  const major = await db.query.majors.findFirst({
    where: eq(majors.id, majorId)
  });
  
  if (!major) throw new NotFoundError('Major', majorId);
  
  // Get all admission methods for this major through the applications table
  const result = await db.query.admissionMethodApplications.findMany({
    where: eq(admissionMethodApplications.major_id, majorId),
    with: {
      admissionMethod: true
    }
  });
  
  // Extract and return just the admission methods
  return result.map((item) => item.admissionMethod);
};

/**
 * Get admission methods by major code
 * This function retrieves all admission methods for a specific major identified by its code
 */
export const getAdmissionMethodsByMajorCode = async (majorCode: string) => {
  const major = await db.query.majors.findFirst({
    where: eq(majors.code, majorCode)
  });
  
  if (!major) throw new NotFoundError('Major with code', majorCode);
  
  // Get all admission methods for this major through the applications table
  const result = await db.query.admissionMethodApplications.findMany({
    where: eq(admissionMethodApplications.major_id, major.id),
    with: {
      admissionMethod: true
    }
  });
  
  // Extract and return just the admission methods
  return result.map((item) => item.admissionMethod);
};


/**
 * Get majors that use a specific admission method
 */
export const getMajorsByAdmissionMethodId = async (admissionMethodId: number) => {
  // Ensure the admission method exists
  await getAdmissionMethodById(admissionMethodId);

  // Fetch application entries for this admission method
  const applications = await db.query.admissionMethodApplications.findMany({
    where: eq(admissionMethodApplications.admission_method_id, admissionMethodId),
    with: { major: true }
  });

  // If a global application exists (major_id is null), return all majors
  if (applications.some(app => app.major === null)) {
    return await db.query.majors.findMany({ orderBy: majors.name });
  }

  // Return specific majors from applications
  return applications.map(app => app.major!);
};

/**
 * Associate a major with an admission method 
 * @param admissionMethodId Admission method ID
 * @param majorId Major ID
 * @param academicYearId Academic year ID
 * @param campusId Optional campus ID
 * @param minScore Optional minimum score
 * @param isActive Optional active status
 * @returns Created admission method application
 */
export const associateMajorWithAdmissionMethod = async (
  admissionMethodId: number,
  majorId: number, 
  academicYearId: number,
  campusId?: number,
  minScore?: number,
  isActive?: boolean
) => {
  // TODO: Implement this function
  throw new Error('Not implemented');
};

/**
 * Create a global admission method application (for all majors)
 * @param admissionMethodId Admission method ID
 * @param academicYearId Academic year ID
 * @param campusId Optional campus ID
 * @param note Optional note
 * @returns Created global admission method application
 */
export const createGlobalAdmissionMethodApplication = async (
  admissionMethodId: number,
  academicYearId: number,
  campusId?: number,
  note?: string
) => {
  // TODO: Implement this function
  throw new Error('Not implemented');
};
