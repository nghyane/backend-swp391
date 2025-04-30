/**
 * Scholarship Service
 * Provides functions to interact with scholarship data
 */

import { eq, and, ilike, sql, exists, SQL } from "drizzle-orm";
import { db } from "@/db/index";
import {
  scholarships,
  majors,
  campuses,
  scholarshipAvailability,
  academicYears
} from "@/db/schema";
import { Scholarship, ScholarshipQueryParams } from '@/types/scholarship.types';
import { NotFoundError } from '@/utils/errors';

// ===== QUERY STRUCTURE CONSTANTS =====

/**
 * Common column selections for different entities
 */
const COLUMN_SELECTIONS = {
  major: { columns: { code: true, name: true } },
  campus: { columns: { code: true, name: true } },
  academicYear: { columns: { year: true } },
  scholarship: {
    id: true,
    name: true,
    description: true,
    amount: true
  }
};

/**
 * Relation configurations for different query types
 */
const RELATION_CONFIGS = {
  // Default query options with name ordering
  defaultQuery: {
    orderBy: scholarships.name,
    with: {
      availabilities: {
        with: {
          major: COLUMN_SELECTIONS.major,
          campus: COLUMN_SELECTIONS.campus,
          academicYear: COLUMN_SELECTIONS.academicYear
        }
      }
    }
  },

  // Query options with amount ordering
  amountSortQuery: {
    orderBy: scholarships.amount,
    with: {
      availabilities: {
        with: {
          major: COLUMN_SELECTIONS.major,
          campus: COLUMN_SELECTIONS.campus,
          academicYear: COLUMN_SELECTIONS.academicYear
        }
      }
    }
  },

  // Full detail relations for scholarship
  fullDetailRelations: {
    availabilities: {
      with: {
        major: true as const,
        campus: true as const,
        academicYear: true as const
      }
    }
  }
};

// ===== HELPER FUNCTIONS =====

/**
 * Resolve major code to ID
 * @param majorCode Major code
 * @returns Major ID or undefined if not found
 */
const resolveMajorCode = async (majorCode?: string): Promise<number | undefined> => {
  if (!majorCode) return undefined;

  const major = await db.query.majors.findFirst({
    where: eq(majors.code, majorCode),
    columns: { id: true }
  });

  return major?.id;
};

/**
 * Resolve campus code to ID
 * @param campusCode Campus code
 * @returns Campus ID or undefined if not found
 */
const resolveCampusCode = async (campusCode?: string): Promise<number | undefined> => {
  if (!campusCode) return undefined;

  const campus = await db.query.campuses.findFirst({
    where: eq(campuses.code, campusCode),
    columns: { id: true }
  });

  return campus?.id;
};

/**
 * Build availability filter for scholarships
 * @param majorId Major ID to filter by
 * @param campusId Campus ID to filter by
 * @returns SQL condition for filtering scholarships by availability
 */
const buildAvailabilityFilter = (majorId?: number, campusId?: number): SQL | undefined => {
  if (!majorId && !campusId) return undefined;

  let majorCondition: SQL | undefined;
  let campusCondition: SQL | undefined;

  if (majorId) {
    // Scholarship applies to specific major OR applies to all majors (major_id IS NULL)
    majorCondition = sql`(${scholarshipAvailability.major_id} = ${majorId} OR ${scholarshipAvailability.major_id} IS NULL)`;
  }

  if (campusId) {
    // Scholarship applies to specific campus OR applies to all campuses (campus_id IS NULL)
    campusCondition = sql`(${scholarshipAvailability.campus_id} = ${campusId} OR ${scholarshipAvailability.campus_id} IS NULL)`;
  }

  // Build final condition
  const conditions = [eq(scholarshipAvailability.scholarship_id, scholarships.id)];
  if (majorCondition) conditions.push(majorCondition);
  if (campusCondition) conditions.push(campusCondition);

  return exists(
    db.select({ dummy: sql`1` })
      .from(scholarshipAvailability)
      .where(and(...conditions))
  );
};

// ===== EXPORTED SERVICE FUNCTIONS =====

/**
 * Get all scholarships with optional filtering
 * @param filters Optional filters for scholarships
 * @returns Array of scholarships matching the filters
 */
export const getAllScholarships = async (filters?: ScholarshipQueryParams): Promise<Scholarship[]> => {
  // Return all scholarships if no filters provided
  if (!filters || Object.keys(filters).length === 0) {
    return await db.query.scholarships.findMany(RELATION_CONFIGS.defaultQuery);
  }

  // Build scholarship name filter
  const scholarshipConditions = [];
  if (filters.name) {
    scholarshipConditions.push(ilike(scholarships.name, `%${filters.name}%`));
  }

  // Resolve IDs from codes if needed
  const majorId = filters.major_id || await resolveMajorCode(filters.major_code);
  const campusId = filters.campus_id || await resolveCampusCode(filters.campus_code);

  // Build availability filter if major or campus is specified
  const availabilityFilter = buildAvailabilityFilter(majorId, campusId);
  if (availabilityFilter) {
    scholarshipConditions.push(availabilityFilter);
  }

  // Execute query with all conditions
  return await db.query.scholarships.findMany({
    ...RELATION_CONFIGS.defaultQuery,
    where: scholarshipConditions.length > 0 ? and(...scholarshipConditions) : undefined
  });
};

/**
 * Get scholarship by ID with all relations
 * @param id Scholarship ID
 * @returns Scholarship with all relations
 * @throws NotFoundError if scholarship not found
 */
export const getScholarshipById = async (id: number): Promise<Scholarship> => {
  const result = await db.query.scholarships.findFirst({
    where: eq(scholarships.id, id),
    with: RELATION_CONFIGS.fullDetailRelations
  });

  if (!result) throw new NotFoundError('Scholarship', id);

  return result;
};

/**
 * Get scholarships by major code
 * @param majorCode Major code to filter by
 * @returns Array of scholarships available for the specified major
 * @throws NotFoundError if major not found
 */
export const getScholarshipsByMajorCode = async (majorCode: string): Promise<Scholarship[]> => {
  // Get major ID from code
  const majorId = await resolveMajorCode(majorCode);
  if (!majorId) throw new NotFoundError('Major', majorCode);

  // Find scholarships with availabilities for this major
  return await db.query.scholarships.findMany({
    ...RELATION_CONFIGS.amountSortQuery,
    where: buildAvailabilityFilter(majorId)
  });
};

/**
 * Get scholarships by campus ID
 * @param campusId Campus ID to filter by
 * @returns Array of scholarships available at the specified campus
 */
export const getScholarshipsByCampusId = async (campusId: number): Promise<Scholarship[]> => {
  return await db.query.scholarships.findMany({
    ...RELATION_CONFIGS.amountSortQuery,
    where: buildAvailabilityFilter(undefined, campusId)
  });
};

/**
 * Create a new scholarship
 * @param data Scholarship data without id
 * @returns Created scholarship
 */
export const createScholarship = async (data: Omit<Scholarship, 'id'>): Promise<Scholarship> => {
  // TODO: Implement this function
  throw new Error('Not implemented');
};

/**
 * Update an existing scholarship
 * @param id Scholarship ID
 * @param data Updated scholarship data
 * @returns Updated scholarship
 */
export const updateScholarship = async (id: number, data: Partial<Omit<Scholarship, 'id'>>): Promise<Scholarship> => {
  // TODO: Implement this function
  throw new Error('Not implemented');
};

/**
 * Delete a scholarship
 * @param id Scholarship ID
 */
export const deleteScholarship = async (id: number): Promise<void> => {
  // TODO: Implement this function
  throw new Error('Not implemented');
};
