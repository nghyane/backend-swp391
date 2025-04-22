import { eq, ilike, and, SQL } from 'drizzle-orm';
import { db } from '../db';
import { admissionMethods, majors, admissionMethodApplications } from '../db/schema';
import { AdmissionMethod, AdmissionMethodFilterOptions, AdmissionMethodApplication } from '../types/admission-method.types';
import { Major } from '../types/major.types';
import { NotFoundError } from '../utils/errors';

const DEFAULT_QUERY_OPTIONS = {
  orderBy: admissionMethods.name
};

export const getAllAdmissionMethods = async (filters?: AdmissionMethodFilterOptions): Promise<AdmissionMethod[]> => {
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

export const getAdmissionMethodById = async (id: number): Promise<AdmissionMethod> => {
  const result = await db.query.admissionMethods.findFirst({
    where: eq(admissionMethods.id, id)
  });
  if (!result) throw new NotFoundError('AdmissionMethod', id);
  return result;
};

export const createAdmissionMethod = async (data: Omit<AdmissionMethod, 'id'>): Promise<AdmissionMethod> => {
  const [newAdmissionMethod] = await db.insert(admissionMethods).values(data).returning();
  return newAdmissionMethod;
};

export const updateAdmissionMethod = async (id: number, data: Partial<Omit<AdmissionMethod, 'id'>>): Promise<AdmissionMethod> => {
  await getAdmissionMethodById(id);
  
  const [updatedAdmissionMethod] = await db.update(admissionMethods)
    .set(data)
    .where(eq(admissionMethods.id, id))
    .returning();
  if (!updatedAdmissionMethod) throw new NotFoundError('AdmissionMethod', id);
  
  return updatedAdmissionMethod;
};

export const deleteAdmissionMethod = async (id: number): Promise<void> => {
  await getAdmissionMethodById(id);
  await db.delete(admissionMethods).where(eq(admissionMethods.id, id));
};

export const getAdmissionMethodsByMajorId = async (majorId: number): Promise<AdmissionMethod[]> => {
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
export const getAdmissionMethodsByMajorCode = async (majorCode: string): Promise<AdmissionMethod[]> => {
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
export const getMajorsByAdmissionMethodId = async (admissionMethodId: number): Promise<Major[]> => {
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
 */
export const associateMajorWithAdmissionMethod = async (
  majorId: number, 
  admissionMethodId: number,
  academicYearId: number,
  campusId?: number,
  minScore?: number,
  note?: string
): Promise<AdmissionMethodApplication> => {
  // Check if major and admission method exist
  await db.query.majors.findFirst({
    where: eq(majors.id, majorId)
  });
  
  await getAdmissionMethodById(admissionMethodId);
  
  // Create the association
  const [result] = await db.insert(admissionMethodApplications).values({
    major_id: majorId,
    admission_method_id: admissionMethodId,
    academic_year_id: academicYearId,
    campus_id: campusId,
    min_score: minScore,
    note: note,
    is_active: true
  }).returning();
  
  return result;
};

/**
 * Create a global admission method application (for all majors)
 */
export const createGlobalAdmissionMethodApplication = async (
  admissionMethodId: number,
  academicYearId: number,
  campusId?: number,
  note?: string
): Promise<AdmissionMethodApplication> => {
  // Check if admission method exists
  await getAdmissionMethodById(admissionMethodId);
  
  // Create the global application (major_id is null)
  const [result] = await db.insert(admissionMethodApplications).values({
    admission_method_id: admissionMethodId,
    academic_year_id: academicYearId,
    campus_id: campusId,
    note: note,
    is_active: true
  }).returning();
  
  return result;
};
