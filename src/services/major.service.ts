import { eq, ilike, or, and, SQL, inArray, sql } from 'drizzle-orm';
import { db } from '../db';
import { majors, majorCampusAdmission, academicYears } from '../db/schema';
import { MajorQueryParams } from '../middlewares/validators/major.validator';
import { NotFoundError } from '../utils/errors';

// Sử dụng type inference từ Drizzle ORM schema
type Major = typeof majors.$inferSelect;

const DEFAULT_QUERY_OPTIONS = {
  with: {
    careers: true as const
  }
};

const RELATIONS_WITH_CAMPUS = {
  major: {
    with: {
      careers: true as const
    }
  },
  campus: true as const
};

/**
 * Get academic year ID from year
 * @param year Academic year (e.g., 2024 for 2024-2025)
 * @returns Academic year ID or null if not found
 */
const getAcademicYearId = async (year: number): Promise<number | null> => {
  const record = await db.query.academicYears.findFirst({
    where: eq(academicYears.year, year),
    columns: { id: true }
  });
  return record ? record.id : null;
};

export const getAllMajors = async (filters?: MajorQueryParams) => {
  if (!filters) return await db.query.majors.findMany(DEFAULT_QUERY_OPTIONS);

  // Filter by campus and academic year
  if (filters.campus_id || filters.academic_year) {
    let admissionConditions: SQL[] = [];
    
    if (filters.campus_id) {
      admissionConditions.push(eq(majorCampusAdmission.campus_id, filters.campus_id));
    }
    
    // Get academic year ID based on the year
    if (filters.academic_year) {
      const yearId = await getAcademicYearId(filters.academic_year);
      if (!yearId) return []; // If the academic year is not found, return an empty array
      
      admissionConditions.push(eq(majorCampusAdmission.academic_year_id, yearId));
    }
    
    // Get the list of major IDs from the majorCampusAdmission table
    const admissions = await db.query.majorCampusAdmission.findMany({
      where: and(...admissionConditions),
      columns: {
        major_id: true
      }
    });
    
    // If no results are found, return an empty array
    if (admissions.length === 0) {
      return [];
    }
    
    // Get the list of major IDs to filter
    const majorIds = admissions.map(a => a.major_id);
    
    // Create conditions for filtering by name and code
    let nameConditions: SQL[] = [];
    if (filters.name) nameConditions.push(ilike(majors.name, `%${filters.name}%`));
    if (filters.code) nameConditions.push(ilike(majors.code, `%${filters.code}%`));
    
    // Create a condition for filtering by major ID
    let majorIdCondition: SQL | undefined;
    if (majorIds.length === 1) {
      majorIdCondition = eq(majors.id, majorIds[0]);
    } else if (majorIds.length > 1) {
      majorIdCondition = inArray(majors.id, majorIds);
    }
    
    // Combine the conditions
    let whereCondition: SQL | undefined;
    
    if (nameConditions.length > 0 && majorIdCondition) {
      whereCondition = and(or(...nameConditions), majorIdCondition);
    } else if (nameConditions.length > 0) {
      whereCondition = or(...nameConditions);
    } else if (majorIdCondition) {
      whereCondition = majorIdCondition;
    }
    
    return await db.query.majors.findMany({
      ...DEFAULT_QUERY_OPTIONS,
      where: whereCondition
    });
  }
  
  // If not filtering by campus or academic year, filter by name and code only
  const conditions: SQL[] = [];
  if (filters.name) conditions.push(ilike(majors.name, `%${filters.name}%`));
  if (filters.code) conditions.push(ilike(majors.code, `%${filters.code}%`));
  
  return await db.query.majors.findMany({
    ...DEFAULT_QUERY_OPTIONS,
    where: conditions.length > 0 ? or(...conditions) : undefined
  });
};

export const getMajorById = async (id: number) => {
  const result = await db.query.majors.findFirst({
    where: eq(majors.id, id),
    ...DEFAULT_QUERY_OPTIONS
  });
  if (!result) throw new NotFoundError('Major', id);
  return result;
};

export const getMajorsByCampusId = async (campusId: number, academicYear?: number) => {
  let conditions: SQL[] = [eq(majorCampusAdmission.campus_id, campusId)];
  
  if (academicYear) {
    const yearId = await getAcademicYearId(academicYear);
    if (!yearId) return [];
    
    conditions.push(eq(majorCampusAdmission.academic_year_id, yearId));
  }
  
  const result = await db.query.majorCampusAdmission.findMany({
    where: and(...conditions),
    with: RELATIONS_WITH_CAMPUS
  });

  return result;
};

/**
 * Create a new major
 * @param data Major data without id
 * @returns Created major
 */
export const createMajor = async (data: Omit<Major, 'id'>) => {
  // TODO: Implement this function
  throw new Error('Not implemented');
};

/**
 * Update an existing major
 * @param id Major ID
 * @param data Updated major data
 * @returns Updated major
 */
export const updateMajor = async (id: number, data: Partial<Omit<Major, 'id'>>) => {
  // TODO: Implement this function
  throw new Error('Not implemented');
};

/**
 * Delete a major
 * @param id Major ID
 */
export const deleteMajor = async (id: number): Promise<void> => {
  // TODO: Implement this function
  throw new Error('Not implemented');
};

/**
 * Get major details by code
 * This function retrieves a major by its unique code rather than ID
 */
export const getMajorByCode = async (code: string) => {
  const result = await db.query.majors.findFirst({
    where: eq(majors.code, code),
    ...DEFAULT_QUERY_OPTIONS
  });
  
  if (!result) throw new NotFoundError('Major with code', code);
  
  return result;
};

