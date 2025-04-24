import { eq, ilike, and, gte, SQL } from 'drizzle-orm';
import { db } from '../db';
import { scholarships, majors } from '../db/schema';
import { Scholarship, ScholarshipQueryParams } from '../types/scholarship.types';
import { NotFoundError } from '../utils/errors';

const RELATIONS = {
  major: true as const,
  campus: true as const
};

const DEFAULT_QUERY_OPTIONS = {
  with: RELATIONS,
  orderBy: scholarships.name
};

const AMOUNT_SORT_OPTIONS = {
  with: RELATIONS,
  orderBy: scholarships.amount
};

export const getAllScholarships = async (filters?: ScholarshipQueryParams): Promise<Scholarship[]> => {
  if (!filters) return await db.query.scholarships.findMany(DEFAULT_QUERY_OPTIONS);
  
  const conditions: SQL[] = [
    filters.name && ilike(scholarships.name, `%${filters.name}%`),
    filters.major_id && eq(scholarships.major_id, filters.major_id),
    filters.campus_id && eq(scholarships.campus_id, filters.campus_id),
    filters.min_amount && gte(scholarships.amount, filters.min_amount)
  ].filter(Boolean) as SQL[];
  
  return await db.query.scholarships.findMany({
    ...DEFAULT_QUERY_OPTIONS,
    where: conditions.length > 0 ? and(...conditions) : undefined
  });
};

export const getScholarshipById = async (id: number): Promise<Scholarship> => {
  const result = await db.query.scholarships.findFirst({
    where: eq(scholarships.id, id),
    with: RELATIONS
  });
  if (!result) throw new NotFoundError('Scholarship', id);
  return result;
};


/**
 * Get scholarships by major code
 * This function retrieves all scholarships for a specific major identified by its code
 */
export const getScholarshipsByMajorCode = async (majorCode: string): Promise<Scholarship[]> => {
  // First get the major by code to find its ID
  const major = await db.query.majors.findFirst({
    where: eq(majors.code, majorCode)
  });
  
  if (!major) throw new NotFoundError('Major with code', majorCode);
  
  // Then get scholarships by the major ID
  return await db.query.scholarships.findMany({
    ...AMOUNT_SORT_OPTIONS,
    where: eq(scholarships.major_id, major.id)
  });
};

export const getScholarshipsByCampusId = async (campusId: number): Promise<Scholarship[]> => {
  return await db.query.scholarships.findMany({
    ...AMOUNT_SORT_OPTIONS,
    where: eq(scholarships.campus_id, campusId)
  });
};

export const getScholarshipsByEligibility = async (criteria: Record<string, any>): Promise<Scholarship[]> => {
  // TODO: Implement this function when eligibility criteria are defined
  throw new Error('Not implemented');
};

/**
 * Create a new scholarship
 * @param data Scholarship data without id
 * @returns Created scholarship
 */
export const createScholarship = async (data: Omit<Scholarship, 'id' | 'major' | 'campus'>): Promise<Scholarship> => {
  // TODO: Implement this function
  throw new Error('Not implemented');
};

/**
 * Update an existing scholarship
 * @param id Scholarship ID
 * @param data Updated scholarship data
 * @returns Updated scholarship
 */
export const updateScholarship = async (id: number, data: Partial<Omit<Scholarship, 'id' | 'major' | 'campus'>>): Promise<Scholarship> => {
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

