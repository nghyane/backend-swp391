import { eq, ilike, and, or, SQL, inArray, isNull } from 'drizzle-orm';
import { db } from '../db';
import { admissionMethods, admissionMethodApplications, majors, campuses, academicYears } from '../db/schema';
import { AdmissionMethodQueryParams } from '../middlewares/validators/admission-method.validator';
import { NotFoundError } from '../utils/errors';

const DEFAULT_QUERY_OPTIONS = {
  orderBy: admissionMethods.name,
  with: {
    applications: {
      columns: {
        min_score: true,
        note: true,
      },
      with: {
        major: {
          columns: {
            code: true
          }
        },
        campus: {
          columns: {
            code: true
          }
        },
        academicYear: {
          columns: {
            year: true
          }
        }
      }
    }
  }
};

export const getAllAdmissionMethods = async (filters?: AdmissionMethodQueryParams) => {
  // If no filters, return all admission methods
  if (!filters || Object.keys(filters).length === 0) {
    return await db.query.admissionMethods.findMany(DEFAULT_QUERY_OPTIONS);
  }

  // Handle basic name filter
  const nameFilter = filters.name ? 
    ilike(admissionMethods.name, `%${filters.name}%`) : undefined;
  
  // If we don't have relational filters, just filter by name
  if (!hasRelationalFilters(filters)) {
    return await db.query.admissionMethods.findMany({
      ...DEFAULT_QUERY_OPTIONS,
      where: nameFilter
    });
  }
  
  // Process relational filters
  // Step 1: Resolve codes to IDs if needed
  let majorId = filters.major_id;
  let campusId = filters.campus_id;
  let academicYearId: number | undefined;
  
  // Find major by code if provided
  if (filters.major_code && !majorId) {
    const major = await db.query.majors.findFirst({
      where: eq(majors.code, filters.major_code)
    });
    if (!major) return []; // No matching major found
    majorId = major.id;
  }
  
  // Find campus by code if provided
  if (filters.campus_code && !campusId) {
    const campus = await db.query.campuses.findFirst({
      where: eq(campuses.code, filters.campus_code)
    });
    if (!campus) return []; // No matching campus found
    campusId = campus.id;
  }
  
  // Find academic year ID if year provided
  if (filters.academic_year) {
    const academicYear = await db.query.academicYears.findFirst({
      where: eq(academicYears.year, filters.academic_year)
    });
    
    if (!academicYear) return []; // No matching academic year found
    academicYearId = academicYear.id;
  }
  
  // Step 2: We'll run two separate queries and combine the results
  // First query: Find methods specific to the major (if majorId is provided)
  let specificMethodIds: number[] = [];
  if (majorId) {
    const specificConditions: SQL[] = [
      eq(admissionMethodApplications.major_id, majorId)
    ];
    
    if (campusId) {
      specificConditions.push(eq(admissionMethodApplications.campus_id, campusId));
    }
    
    if (academicYearId) {
      specificConditions.push(eq(admissionMethodApplications.academic_year_id, academicYearId));
    }
    
    if (filters.is_active !== undefined) {
      specificConditions.push(eq(admissionMethodApplications.is_active, filters.is_active));
    }
    
    const specificApplications = await db
      .select({ id: admissionMethodApplications.admission_method_id })
      .from(admissionMethodApplications)
      .where(and(...specificConditions));
    
    specificMethodIds = specificApplications.map(app => app.id);
  }
  
  // Second query: Find methods that apply to all majors (major_id IS NULL)
  const globalConditions: SQL[] = [
    isNull(admissionMethodApplications.major_id)
  ];
  
  if (campusId) {
    globalConditions.push(eq(admissionMethodApplications.campus_id, campusId));
  }
  
  if (academicYearId) {
    globalConditions.push(eq(admissionMethodApplications.academic_year_id, academicYearId));
  }
  
  if (filters.is_active !== undefined) {
    globalConditions.push(eq(admissionMethodApplications.is_active, filters.is_active));
  }
  
  const globalApplications = await db
    .select({ id: admissionMethodApplications.admission_method_id })
    .from(admissionMethodApplications)
    .where(and(...globalConditions));
  
  const globalMethodIds = globalApplications.map(app => app.id);
  
  // Combine the results from both queries, removing duplicates
  const allMethodIds = [...new Set([...specificMethodIds, ...globalMethodIds])];
  
  // If no matches found in either query, return empty array
  if (allMethodIds.length === 0) {
    return [];
  }
  
  // Final conditions combining ID filter and name filter
  const finalConditions: SQL[] = [
    inArray(admissionMethods.id, allMethodIds)
  ];
  
  if (nameFilter) {
    finalConditions.push(nameFilter);
  }
  
  // Return filtered admission methods
  return await db.query.admissionMethods.findMany({
    ...DEFAULT_QUERY_OPTIONS,
    where: and(...finalConditions)
  });
};

// Helper function to check if we have any relational filters
const hasRelationalFilters = (filters: AdmissionMethodQueryParams): boolean => {
  return !!(filters.major_code || filters.major_id || 
           filters.campus_code || filters.campus_id || 
           filters.academic_year || filters.is_active !== undefined);
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
