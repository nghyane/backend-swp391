/**
 * Dormitory Service
 * Provides functions to interact with dormitory data
 */

import { eq, and, like, ilike, inArray, SQL } from "drizzle-orm";
import { db } from "@/db/index";
import { dormitories, campuses } from "@/db/schema";
import { Dormitory, DormitoryQueryParams } from "@/types/dormitory.types";
import { NotFoundError } from "@/utils/errors";
import { logger } from "@/utils/logger";

// ===== QUERY STRUCTURE CONSTANTS =====

/**
 * Common column selections for different entities
 */
const COLUMN_SELECTIONS = {
  campus: {
    columns: {
      id: true,
      name: true,
      code: true
    }
  },
  dormitory: {
    columns: {
      id: true,
      name: true,
      address: true,
      description: true,
      campus_id: true
    }
  }
};

/**
 * Relation configurations for different query types
 */
const RELATION_CONFIGS = {
  // Default query options for listing dormitories
  defaultQuery: {
    with: {
      campus: COLUMN_SELECTIONS.campus
    }
  }
};

// ===== HELPER FUNCTIONS =====

/**
 * Build filter conditions for dormitories
 * @param filterOptions Filter options for dormitories
 * @returns Array of SQL conditions
 */
const buildDormitoryFilterConditions = (filterOptions: DormitoryQueryParams): SQL[] => {
  const conditions: SQL[] = [];

  // Filter by name
  if (filterOptions.name) {
    conditions.push(ilike(dormitories.name, `%${filterOptions.name}%`));
  }

  // Filter by campus ID
  if (filterOptions.campus_id) {
    conditions.push(eq(dormitories.campus_id, filterOptions.campus_id));
  }

  return conditions;
};

// ===== EXPORTED SERVICE FUNCTIONS =====

/**
 * Get all dormitories with optional filtering
 * @param filterOptions Optional filters for dormitories
 * @returns Array of dormitories matching the filters
 */
export const getAllDormitories = async (filterOptions?: DormitoryQueryParams) => {
  // If no filters, return all dormitories
  if (!filterOptions) {
    return await db.query.dormitories.findMany(RELATION_CONFIGS.defaultQuery);
  }

  // Build base filter conditions
  const conditions: SQL[] = buildDormitoryFilterConditions(filterOptions);

  // Handle campus code filter if present
  if (filterOptions.campus_code && !filterOptions.campus_id) {
    // Use subquery to filter by campus_code in a single database call
    const subquery = db
      .select({ id: campuses.id })
      .from(campuses)
      .where(eq(campuses.code, filterOptions.campus_code));

    conditions.push(inArray(dormitories.campus_id, subquery));
  }

  // If no conditions were added, return all dormitories
  if (conditions.length === 0) {
    return await db.query.dormitories.findMany(RELATION_CONFIGS.defaultQuery);
  }

  // Execute query with all filters
  return await db.query.dormitories.findMany({
    ...RELATION_CONFIGS.defaultQuery,
    where: and(...conditions)
  });
};

/**
 * Get dormitory by ID
 * @param id Dormitory ID
 * @returns Dormitory with campus information
 * @throws NotFoundError if dormitory not found
 */
export const getDormitoryById = async (id: number) => {
  const result = await db.query.dormitories.findFirst({
    where: eq(dormitories.id, id),
    with: {
      campus: true
    }
  });

  if (!result) throw new NotFoundError('Dormitory', id);

  return result;
};

/**
 * Get dormitories by campus ID
 * @param campusId Campus ID
 * @returns Array of dormitories for the specified campus
 * @throws NotFoundError if campus not found
 */
export const getDormitoriesByCampusId = async (campusId: number) => {
  // Verify campus exists
  const campusExists = await db.query.campuses.findFirst({
    where: eq(campuses.id, campusId),
    columns: { id: true }
  });

  if (!campusExists) throw new NotFoundError("Campus", campusId);

  // Get dormitories for this campus
  return await db.query.dormitories.findMany({
    ...RELATION_CONFIGS.defaultQuery,
    where: eq(dormitories.campus_id, campusId)
  });
};

/**
 * Create a new dormitory
 * @param data Dormitory data without id
 * @returns Created dormitory
 * @throws Error if campus does not exist
 */
export const createDormitory = async (data: Omit<Dormitory, 'id' | 'campus'> & { campus_id: number }) => {
  // Verify campus exists
  const campusExists = await db.query.campuses.findFirst({
    where: eq(campuses.id, data.campus_id),
    columns: { id: true }
  });

  if (!campusExists) {
    throw new NotFoundError("Campus", data.campus_id);
  }

  // Insert new dormitory into database
  const [newDormitory] = await db.insert(dormitories).values(data).returning();

  // Get the complete dormitory with campus information
  const result = await getDormitoryById(newDormitory.id);

  logger.info(`Created new dormitory: ${newDormitory.name} at campus ID ${newDormitory.campus_id}`);
  return result;
};

/**
 * Update an existing dormitory
 * @param id Dormitory ID
 * @param data Updated dormitory data
 * @returns Updated dormitory
 * @throws NotFoundError if dormitory not found
 * @throws NotFoundError if campus does not exist
 */
export const updateDormitory = async (id: number, data: Partial<Omit<Dormitory, 'id' | 'campus'>> & { campus_id?: number }) => {
  // Check if dormitory exists
  const existingDormitory = await db.query.dormitories.findFirst({
    where: eq(dormitories.id, id)
  });

  if (!existingDormitory) {
    throw new NotFoundError('Dormitory', id);
  }

  // If updating campus_id, verify the campus exists
  if (data.campus_id) {
    const campusExists = await db.query.campuses.findFirst({
      where: eq(campuses.id, data.campus_id),
      columns: { id: true }
    });

    if (!campusExists) {
      throw new NotFoundError("Campus", data.campus_id);
    }
  }

  // Update dormitory in database
  const [updatedDormitory] = await db
    .update(dormitories)
    .set(data)
    .where(eq(dormitories.id, id))
    .returning();

  // Get the complete dormitory with campus information
  const result = await getDormitoryById(updatedDormitory.id);

  logger.info(`Updated dormitory: ${updatedDormitory.name} (ID: ${updatedDormitory.id})`);
  return result;
};

/**
 * Delete a dormitory
 * @param id Dormitory ID
 * @throws NotFoundError if dormitory not found
 */
export const deleteDormitory = async (id: number): Promise<void> => {
  // Check if dormitory exists
  const existingDormitory = await db.query.dormitories.findFirst({
    where: eq(dormitories.id, id),
    columns: { id: true, name: true }
  });

  if (!existingDormitory) {
    throw new NotFoundError('Dormitory', id);
  }

  // Delete dormitory from database
  await db.delete(dormitories).where(eq(dormitories.id, id));

  logger.info(`Deleted dormitory: ${existingDormitory.name} (ID: ${existingDormitory.id})`);
};
