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
 * @param data Scholarship data without id and with availability information
 * @returns Created scholarship
 */
export const createScholarship = async (data: ScholarshipCreateParams): Promise<Scholarship> => {
  // Extract scholarship data and availability data
  const { major_id, campus_id, ...scholarshipData } = data;

  // Start a transaction to ensure data consistency
  return await db.transaction(async (tx) => {
    // 1. Insert the scholarship
    const [newScholarship] = await tx
      .insert(scholarships)
      .values(scholarshipData)
      .returning();

    // 2. Get current academic year
    const currentYear = new Date().getFullYear();
    const academicYear = await tx.query.academicYears.findFirst({
      where: eq(academicYears.year, currentYear),
      columns: { id: true }
    });

    if (!academicYear) {
      throw new Error(`Academic year ${currentYear} not found`);
    }

    // 3. Create scholarship availability record
    await tx.insert(scholarshipAvailability).values({
      scholarship_id: newScholarship.id,
      academic_year_id: academicYear.id,
      campus_id: campus_id,
      major_id: major_id
    });

    // Return the created scholarship with relations
    return newScholarship;
  });
};

/**
 * Update an existing scholarship
 * @param id Scholarship ID
 * @param data Updated scholarship data
 * @returns Updated scholarship
 * @throws NotFoundError if scholarship not found
 */
export const updateScholarship = async (id: number, data: ScholarshipUpdateParams): Promise<Scholarship> => {
  // Check if scholarship exists
  const existingScholarship = await db.query.scholarships.findFirst({
    where: eq(scholarships.id, id)
  });

  if (!existingScholarship) {
    throw new NotFoundError('Scholarship', id);
  }

  // Extract scholarship data and availability data
  const { major_id, campus_id, ...scholarshipData } = data;

  // Start a transaction to ensure data consistency
  return await db.transaction(async (tx) => {
    // 1. Update the scholarship
    const [updatedScholarship] = await tx
      .update(scholarships)
      .set(scholarshipData)
      .where(eq(scholarships.id, id))
      .returning();

    // 2. Update availability if major_id or campus_id is provided
    if (major_id !== undefined || campus_id !== undefined) {
      // Get current academic year
      const currentYear = new Date().getFullYear();
      const academicYear = await tx.query.academicYears.findFirst({
        where: eq(academicYears.year, currentYear),
        columns: { id: true }
      });

      if (!academicYear) {
        throw new Error(`Academic year ${currentYear} not found`);
      }

      // Find existing availability record for current year
      const existingAvailability = await tx.query.scholarshipAvailability.findFirst({
        where: and(
          eq(scholarshipAvailability.scholarship_id, id),
          eq(scholarshipAvailability.academic_year_id, academicYear.id)
        )
      });

      if (existingAvailability) {
        // Update existing availability
        const updateData: any = {};
        if (major_id !== undefined) updateData.major_id = major_id;
        if (campus_id !== undefined) updateData.campus_id = campus_id;

        await tx
          .update(scholarshipAvailability)
          .set(updateData)
          .where(eq(scholarshipAvailability.id, existingAvailability.id));
      } else if (major_id || campus_id) {
        // Create new availability if it doesn't exist
        await tx.insert(scholarshipAvailability).values({
          scholarship_id: id,
          academic_year_id: academicYear.id,
          campus_id: campus_id || null,
          major_id: major_id || null
        });
      }
    }

    // Return the updated scholarship
    return updatedScholarship;
  });
};

/**
 * Delete a scholarship
 * @param id Scholarship ID
 * @throws NotFoundError if scholarship not found
 */
export const deleteScholarship = async (id: number): Promise<void> => {
  // Check if scholarship exists
  const existingScholarship = await db.query.scholarships.findFirst({
    where: eq(scholarships.id, id)
  });

  if (!existingScholarship) {
    throw new NotFoundError('Scholarship', id);
  }

  // Delete the scholarship (availability records will be deleted automatically due to CASCADE)
  await db.delete(scholarships).where(eq(scholarships.id, id));
};
