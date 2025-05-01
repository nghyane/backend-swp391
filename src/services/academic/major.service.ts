/**
 * Major Service
 * Provides functions to interact with major data
 */

import { eq, ilike, or, and, SQL, inArray } from 'drizzle-orm';
import { db } from '@/db/index';
import {
  majors,
  majorCampusAdmission,
  academicYears,
  campuses,
  scholarshipAvailability
} from '@/db/schema';
import { MajorQueryParams, MajorCreateParams, MajorUpdateParams } from '@/middlewares/validators/major.validator';
import { NotFoundError } from '@/utils/errors';
import { createNamespace } from '@/utils/pino-logger';

const logger = createNamespace('major-service');

// ===== QUERY CONFIGURATIONS =====

/**
 * Common query configurations for major-related queries
 */
const QUERY_CONFIG = {
  // Basic major fields to select
  majorFields: {
    id: true,
    name: true,
    code: true
  },

  // Default relations for listing majors
  defaultRelations: {
    careers: true as const,
    majorCampusAdmissions: {
      with: {
        campus: { columns: { code: true, name: true } },
        academicYear: { columns: { year: true } }
      },
      columns: {
        tuition_fee: true,
        quota: true
      }
    }
  },

  // Full relations for detailed major views
  detailRelations: {
    careers: true as const,
    admissionMethodApplications: true as const,
    majorCampusAdmissions: {
      with: {
        campus: true as const,
        academicYear: true as const
      }
    },
    scholarshipAvailabilities: {
      with: {
        scholarship: true as const,
        academicYear: true as const,
        campus: true as const
      }
    }
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

// ===== EXPORTED SERVICE FUNCTIONS =====

/**
 * Get all majors with optional filtering
 * @param filters Optional filters for majors
 * @returns Array of majors matching the filters
 */
export const getAllMajors = async (filters?: MajorQueryParams) => {
  // Return all majors if no filters provided
  if (!filters) {
    return await db.query.majors.findMany({
      columns: QUERY_CONFIG.majorFields,
      with: QUERY_CONFIG.defaultRelations
    });
  }

  // Build name/code filter conditions
  const nameConditions: SQL[] = [];
  if (filters.name) nameConditions.push(ilike(majors.name, `%${filters.name}%`));
  if (filters.major_code) nameConditions.push(ilike(majors.code, `%${filters.major_code}%`));

  // If no campus or academic year filter, just filter by name/code
  if (!filters.campus_id && !filters.academic_year) {
    return await db.query.majors.findMany({
      columns: QUERY_CONFIG.majorFields,
      with: QUERY_CONFIG.defaultRelations,
      where: nameConditions.length > 0 ? or(...nameConditions) : undefined
    });
  }

  // Handle filtering by campus and/or academic year
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
    where: and(...admissionConditions),
    columns: { major_id: true }
  });

  if (admissions.length === 0) return [];

  const majorIds = admissions.map(a => a.major_id);
  const majorIdCondition = majorIds.length === 1
    ? eq(majors.id, majorIds[0])
    : inArray(majors.id, majorIds);

  // Combine conditions
  const whereCondition = nameConditions.length > 0
    ? and(or(...nameConditions), majorIdCondition)
    : majorIdCondition;

  return await db.query.majors.findMany({
    columns: QUERY_CONFIG.majorFields,
    with: QUERY_CONFIG.defaultRelations,
    where: whereCondition
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
    with: QUERY_CONFIG.detailRelations
  });

  if (!result) throw new NotFoundError('Major', id);
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
    with: {
      major: {
        with: { careers: true as const }
      },
      campus: true as const
    }
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
  const campus = await db.query.campuses.findFirst({
    where: eq(campuses.code, campusCode),
    columns: { id: true }
  });

  if (!campus) throw new NotFoundError('Campus', campusCode);
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

  // Query major details with filtered relations
  const result = await db.query.majors.findFirst({
    where: eq(majors.code, code),
    with: {
      careers: true as const,
      admissionMethodApplications: true as const,
      majorCampusAdmissions: academicYearId ? {
        where: eq(majorCampusAdmission.academic_year_id, academicYearId),
        with: {
          campus: true as const,
          academicYear: true as const
        }
      } : {
        with: {
          campus: true as const,
          academicYear: true as const
        }
      },
      scholarshipAvailabilities: academicYearId ? {
        where: eq(scholarshipAvailability.academic_year_id, academicYearId),
        with: {
          scholarship: true as const,
          academicYear: true as const,
          campus: true as const
        }
      } : {
        with: {
          scholarship: true as const,
          academicYear: true as const,
          campus: true as const
        }
      }
    }
  });

  if (!result) throw new NotFoundError('Major', code);
  return result;
};

/**
 * Create a new major
 * @param data Major data without id
 * @returns Created major
 * @throws Error if major with the same code already exists
 */
export const createMajor = async (data: MajorCreateParams) => {
  // Check if major with the same code already exists
  const existingMajor = await db.query.majors.findFirst({
    where: eq(majors.code, data.code),
    columns: { id: true }
  });

  if (existingMajor) {
    throw new Error(`Major with code '${data.code}' already exists`);
  }

  // Insert new major into database
  const [newMajor] = await db.insert(majors).values(data).returning();

  logger.info(`Created new major: ${newMajor.name} (${newMajor.code})`);

  // Return the created major with relations
  return await getMajorById(newMajor.id);
};

/**
 * Update an existing major
 * @param id Major ID
 * @param data Updated major data
 * @returns Updated major
 * @throws NotFoundError if major not found
 */
export const updateMajor = async (id: number, data: MajorUpdateParams) => {
  // Check if major exists
  await getMajorById(id);

  // Update major in database
  const [updatedMajor] = await db
    .update(majors)
    .set(data)
    .where(eq(majors.id, id))
    .returning();

  logger.info(`Updated major: ${updatedMajor.name} (ID: ${updatedMajor.id})`);

  // Return the updated major with relations
  return await getMajorById(updatedMajor.id);
};

/**
 * Delete a major
 * @param id Major ID
 * @throws NotFoundError if major not found
 * @description Sau khi cập nhật database constraints, việc xóa major sẽ tự động:
 * - Xóa careers (ON DELETE CASCADE)
 * - Xóa majorCampusAdmission (ON DELETE CASCADE)
 * - Set NULL cho scholarshipAvailability (ON DELETE SET NULL)
 * - Set NULL cho admissionMethodApplications (ON DELETE SET NULL)
 */
export const deleteMajor = async (id: number): Promise<void> => {
  // Check if major exists
  const existingMajor = await db.query.majors.findFirst({
    where: eq(majors.id, id),
    columns: { id: true, name: true, code: true }
  });

  if (!existingMajor) {
    throw new NotFoundError('Major', id);
  }

  // Delete major - các bảng liên quan sẽ được xử lý tự động bởi database constraints
  await db.delete(majors).where(eq(majors.id, id));

  logger.info(`Deleted major: ${existingMajor.name} (ID: ${existingMajor.id})`);
};
