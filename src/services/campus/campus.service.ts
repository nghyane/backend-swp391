import { eq, ilike, or, SQL } from 'drizzle-orm';
import { db } from '@/db/index';
import { campuses } from '@/db/schema';
import { Campus, CampusQueryParams } from '@/types/campus.types';
import { NotFoundError } from '@/utils/errors';

const DEFAULT_QUERY_OPTIONS = {
  orderBy: campuses.name
};

export const getAllCampuses = async (filters?: CampusQueryParams) => {
  if (!filters || Object.keys(filters).length === 0) {
    return db.query.campuses.findMany(DEFAULT_QUERY_OPTIONS);
  }

  const conditions: SQL[] = [
    filters.name && ilike(campuses.name, `%${filters.name}%`),
    filters.campus_code && eq(campuses.code, filters.campus_code),
    filters.address && ilike(campuses.address, `%${filters.address}%`)
  ].filter(Boolean) as SQL[];

  if (conditions.length === 0) {
    return db.query.campuses.findMany(DEFAULT_QUERY_OPTIONS);
  }

  return db.query.campuses.findMany({
    ...DEFAULT_QUERY_OPTIONS,
    where: or(...conditions)
  });
};

export const getCampusById = async (id: number): Promise<Campus> => {
  const result = await db.query.campuses.findFirst({
    where: eq(campuses.id, id)
  });
  if (!result) throw new NotFoundError('Campus', id);
  return result;
};

/**
 * Create a new campus
 * @param data Campus data without id
 * @returns Created campus
 */
export const createCampus = async (data: Omit<Campus, 'id'>): Promise<Campus> => {
  // TODO: Implement this function
  throw new Error('Not implemented');
};

/**
 * Update an existing campus
 * @param id Campus ID
 * @param data Updated campus data
 * @returns Updated campus
 */
export const updateCampus = async (id: number, data: Partial<Omit<Campus, 'id'>>): Promise<Campus> => {
  // TODO: Implement this function
  throw new Error('Not implemented');
};

/**
 * Delete a campus
 * @param id Campus ID
 */
export const deleteCampus = async (id: number): Promise<void> => {
  // TODO: Implement this function
  throw new Error('Not implemented');
};

export const getCampusMajors = async (campusId: number): Promise<unknown> => {
  // TODO: Implement this function when the relationship is established
  throw new Error('Not implemented');
};
