/**
 * Major Service
 * Provides functions to interact with major data
 */

import { eq, ilike, or, and, SQL, inArray } from 'drizzle-orm';
import { db } from '../db';
import { 
  majors, 
  careers, 
  majorCampusAdmission, 
  academicYears, 
  campuses, 
  scholarshipAvailability 
} from '../db/schema';
import { MajorQueryParams } from '../middlewares/validators/major.validator';
import { NotFoundError } from '../utils/errors';
import { Major } from '../types/major.types';

// ===== QUERY STRUCTURE CONSTANTS =====

/**
 * Common column selections for different entities
 */
const COLUMN_SELECTIONS = {
  campus: {
    columns: { code: true, name: true }
  },
  academicYear: {
    columns: { year: true }
  },
  major: {
    id: true,
    name: true,
    code: true
  },
  majorCampusAdmission: {
    tuition_fee: true,
    quota: true
  },
  scholarship: {
    columns: { name: true, description: true }
  }
};

/**
 * Relation configurations for different query types
 */
const RELATION_CONFIGS = {
  // Default query options for listing majors
  defaultMajorQuery: {
    columns: COLUMN_SELECTIONS.major,
    with: {
      majorCampusAdmissions: {
        with: {
          campus: COLUMN_SELECTIONS.campus,
          academicYear: COLUMN_SELECTIONS.academicYear
        },
        columns: COLUMN_SELECTIONS.majorCampusAdmission
      }
    }
  },
  
  // Relations for major with campus
  majorWithCampus: {
    major: {
      with: {
        careers: true as const
      }
    },
    campus: true as const
  },
  
  // Core relations for major detail views
  majorDetail: {
    careers: true as const,
    admissionMethodApplications: true as const
  }
};

// ===== HELPER FUNCTIONS =====

/**
 * Get academic year ID from calendar year
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

/**
 * Build filter conditions for academic year
 * @param academicYear Calendar year to filter by
 * @returns SQL condition or undefined if no year provided
 */
const buildAcademicYearCondition = async (academicYear?: number): Promise<SQL | undefined> => {
  if (!academicYear) return undefined;
  
  const yearId = await getAcademicYearId(academicYear);
  if (!yearId) return undefined;
  
  return eq(majorCampusAdmission.academic_year_id, yearId);
};

// ===== EXPORTED SERVICE FUNCTIONS =====

/**
 * Get all majors with optional filtering
 * @param filters Optional filters for majors
 * @returns Array of majors matching the filters
 */
export const getAllMajors = async (filters?: MajorQueryParams) => {
  // Return all majors if no filters provided
  if (!filters) {
    return await db.query.majors.findMany(RELATION_CONFIGS.defaultMajorQuery);
  }

  // Handle filtering by campus and academic year
  if (filters.campus_id || filters.academic_year) {
    // Build admission conditions
    const admissionConditions: SQL[] = [];
    
    if (filters.campus_id) {
      admissionConditions.push(eq(majorCampusAdmission.campus_id, filters.campus_id));
    }
    
    if (filters.academic_year) {
      const yearId = await getAcademicYearId(filters.academic_year);
      if (!yearId) return []; // Year not found, return empty array
      
      admissionConditions.push(eq(majorCampusAdmission.academic_year_id, yearId));
    }
    
    // Get major IDs from admission records
    const admissions = await db.query.majorCampusAdmission.findMany({
      where: admissionConditions.length > 0 ? and(...admissionConditions) : undefined,
      columns: { major_id: true }
    });
    
    if (admissions.length === 0) return [];
    
    const majorIds = admissions.map(a => a.major_id);
    
    // Build name/code filter conditions
    const nameConditions: SQL[] = [];
    if (filters.name) nameConditions.push(ilike(majors.name, `%${filters.name}%`));
    if (filters.code) nameConditions.push(ilike(majors.code, `%${filters.code}%`));
    
    // Build major ID condition
    const majorIdCondition = majorIds.length === 1 
      ? eq(majors.id, majorIds[0]) 
      : inArray(majors.id, majorIds);
    
    // Combine conditions
    const whereCondition = nameConditions.length > 0
      ? and(or(...nameConditions), majorIdCondition)
      : majorIdCondition;
    
    return await db.query.majors.findMany({
      ...RELATION_CONFIGS.defaultMajorQuery,
      where: whereCondition
    });
  }
  
  // Filter by name and code only
  const conditions: SQL[] = [];
  if (filters.name) conditions.push(ilike(majors.name, `%${filters.name}%`));
  if (filters.code) conditions.push(ilike(majors.code, `%${filters.code}%`));
  
  return await db.query.majors.findMany({
    ...RELATION_CONFIGS.defaultMajorQuery,
    where: conditions.length > 0 ? or(...conditions) : undefined
  });
};

/**
 * Get major by ID with all relations
 * @param id Major ID
 * @returns Major with all relations
 * @throws NotFoundError if major not found
 */
export const getMajorById = async (id: number) => {
  const result = await db.query.majors.findFirst({
    where: eq(majors.id, id),
    with: {
      ...RELATION_CONFIGS.majorDetail,
      majorCampusAdmissions: {
        with: {
          campus: true,
          academicYear: true
        }
      },
      scholarshipAvailabilities: {
        with: {
          scholarship: true,
          academicYear: true,
          campus: true
        }
      }
    }
  });

  if (!result) throw new NotFoundError('Major with ID', id.toString());

  return result;
};

/**
 * Get majors by campus ID with optional academic year filter
 * @param campusId Campus ID
 * @param academicYear Optional academic year (calendar year)
 * @returns Array of majors with campus admission details
 */
export const getMajorsByCampusId = async (campusId: number, academicYear?: number) => {
  const conditions: SQL[] = [eq(majorCampusAdmission.campus_id, campusId)];
  
  if (academicYear) {
    const yearId = await getAcademicYearId(academicYear);
    if (!yearId) return [];
    
    conditions.push(eq(majorCampusAdmission.academic_year_id, yearId));
  }
  
  return await db.query.majorCampusAdmission.findMany({
    where: and(...conditions),
    with: RELATION_CONFIGS.majorWithCampus
  });
};

/**
 * Get majors by campus code with optional academic year filter
 * @param campusCode Campus code (e.g., "HN", "HCM")
 * @param academicYear Optional academic year (calendar year)
 * @returns Array of majors with campus admission details
 * @throws NotFoundError if campus not found
 */
export const getMajorsByCampusCode = async (campusCode: string, academicYear?: number) => {
  // Find campus by code
  const campus = await db.query.campuses.findFirst({
    where: eq(campuses.code, campusCode),
    columns: { id: true }
  });
  
  if (!campus) throw new NotFoundError('Campus with code', campusCode);
  
  // Reuse getMajorsByCampusId to avoid code duplication
  return await getMajorsByCampusId(campus.id, academicYear);
};

/**
 * Get major details by code
 * @param code Major code to search for
 * @param academicYear Optional academic year (calendar year) to filter related data
 * @returns Major with filtered relations
 * @throws NotFoundError if major not found
 */
export const getMajorByCode = async (code: string, academicYear?: number) => {
  // Get academic year ID if provided
  let academicYearId: number | undefined;
  
  if (academicYear) {
    const yearId = await getAcademicYearId(academicYear);
    if (yearId) academicYearId = yearId;
  }

  // Build relation configurations
  const majorCampusRelations = {
    with: {
      campus: COLUMN_SELECTIONS.campus,
      academicYear: COLUMN_SELECTIONS.academicYear
    },
    columns: COLUMN_SELECTIONS.majorCampusAdmission
  };
  
  const scholarshipRelations = {
    with: {
      scholarship: COLUMN_SELECTIONS.scholarship,
      academicYear: COLUMN_SELECTIONS.academicYear,
      campus: COLUMN_SELECTIONS.campus
    }
  };

  // Query major details
  const result = await db.query.majors.findFirst({
    where: eq(majors.code, code),
    with: {
      ...RELATION_CONFIGS.majorDetail,
      majorCampusAdmissions: academicYearId ? {
        where: eq(majorCampusAdmission.academic_year_id, academicYearId),
        ...majorCampusRelations
      } : majorCampusRelations,
      scholarshipAvailabilities: academicYearId ? {
        where: eq(scholarshipAvailability.academic_year_id, academicYearId),
        ...scholarshipRelations
      } : scholarshipRelations
    }
  });
  
  if (!result) throw new NotFoundError('Major with code', code);
  
  return result;
};

// ===== CRUD OPERATIONS (TO BE IMPLEMENTED) =====

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

