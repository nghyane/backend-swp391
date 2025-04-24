import { eq, and, like, SQL } from "drizzle-orm";
import { db } from "../db";
import { dormitories, campuses } from "../db/schema";
import { Dormitory, DormitoryQueryParams } from "../types/dormitory.types";
import { NotFoundError } from "../utils/errors";

const RELATIONS = { campus: true } as const;

const DEFAULT_QUERY_OPTIONS = {
  with: RELATIONS,
  orderBy: dormitories.name
};

export const getAllDormitories = async (filterOptions?: DormitoryQueryParams) => {
  if (!filterOptions) return await db.query.dormitories.findMany(DEFAULT_QUERY_OPTIONS);
  
  const filters: SQL[] = [];
  if (filterOptions.name) filters.push(like(dormitories.name, `%${filterOptions.name}%`));
  if (filterOptions.campusId) filters.push(eq(dormitories.campus_id, filterOptions.campusId));
  
  if (filters.length === 0) return await db.query.dormitories.findMany(DEFAULT_QUERY_OPTIONS);
  
  return await db.query.dormitories.findMany({
    ...DEFAULT_QUERY_OPTIONS,
    where: and(...filters)
  });
};

export const getDormitoryById = async (id: number) => {
  const result = await db.query.dormitories.findFirst({
    where: eq(dormitories.id, id),
    with: RELATIONS
  });
  if (!result) throw new NotFoundError("Dormitory", id);
  return result;
};

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

export const getDormitoriesByCampusId = async (campusId: number) => {
  const campusExists = await db.query.campuses.findFirst({
    where: eq(campuses.id, campusId)
  });
  if (!campusExists) throw new NotFoundError("Campus", campusId);
  
  return await db.query.dormitories.findMany({
    ...DEFAULT_QUERY_OPTIONS,
    where: eq(dormitories.campus_id, campusId)
  });
};
