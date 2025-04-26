/**
 * Dormitory Service
 * Provides functions to interact with dormitory data
 */

import { eq, and, like, ilike, inArray, SQL } from "drizzle-orm";
import { db } from "../db";
import { dormitories, campuses } from "../db/schema";
import { Dormitory, DormitoryQueryParams } from "../types/dormitory.types";
import { NotFoundError } from "../utils/errors";

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
  // Default relations for dormitory queries
  defaultRelations: { 
    campus: true 
  } as const,
  
  // Default query options for listing dormitories
  defaultQuery: {
    with: { campus: true } as const,
    orderBy: dormitories.name
  }
};

// ===== HELPER FUNCTIONS =====

/**
 * Build filter conditions for dormitory queries
 * @param filterOptions Filter options for dormitories
 * @returns Array of SQL conditions
 */
const buildDormitoryFilterConditions = (filterOptions: DormitoryQueryParams): SQL[] => {
  const conditions: SQL[] = [];
  
  // Name filter
  if (filterOptions.name) {
    conditions.push(ilike(dormitories.name, `%${filterOptions.name}%`));
  }
  
  // Campus filter by ID
  if (filterOptions.campus_id) {
    conditions.push(eq(dormitories.campus_id, filterOptions.campus_id));
  }
  
  return conditions;
};

/**
 * Resolve campus code to campus ID
 * @param campusCode Campus code
 * @returns Campus ID or undefined if not found
 */
const resolveCampusCode = async (campusCode: string): Promise<number | undefined> => {
  if (!campusCode) return undefined;
  
  const campus = await db.query.campuses.findFirst({
    where: eq(campuses.code, campusCode),
    columns: { id: true }
  });
  
  return campus?.id;
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
    with: RELATION_CONFIGS.defaultRelations
  });
  
  if (!result) throw new NotFoundError("Dormitory with ID", id.toString());
  
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
  
  if (!campusExists) throw new NotFoundError("Campus with ID", campusId.toString());
  
  // Get dormitories for this campus
  return await db.query.dormitories.findMany({
    ...RELATION_CONFIGS.defaultQuery,
    where: eq(dormitories.campus_id, campusId)
  });
};

// ===== CRUD OPERATIONS (TO BE IMPLEMENTED) =====

/**
 * Create a new dormitory
 * @param data Dormitory data without id and campus
 * @returns Created dormitory
 */
export const createDormitory = async (data: Omit<Dormitory, 'id' | 'campus'>) => {
  // TODO: Implement this function
  throw new Error('Not implemented');
};

/**
 * Update an existing dormitory
 * @param id Dormitory ID
 * @param data Updated dormitory data
 * @returns Updated dormitory
 */
export const updateDormitory = async (id: number, data: Partial<Omit<Dormitory, 'id' | 'campus'>>) => {
  // TODO: Implement this function
  throw new Error('Not implemented');
};

/**
 * Delete a dormitory
 * @param id Dormitory ID
 */
export const deleteDormitory = async (id: number): Promise<void> => {
  // TODO: Implement this function
  throw new Error('Not implemented');
};
