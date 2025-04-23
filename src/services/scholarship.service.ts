import { eq, ilike, and, gte, SQL } from 'drizzle-orm';
import { db } from '../db';
import { scholarships, majors } from '../db/schema';
import { Scholarship, ScholarshipFilterOptions } from '../types/scholarship.types';
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

export const getAllScholarships = async (filters?: ScholarshipFilterOptions): Promise<Scholarship[]> => {
  if (!filters) return await db.query.scholarships.findMany(DEFAULT_QUERY_OPTIONS);
  
  const conditions: SQL[] = [
    filters.name && ilike(scholarships.name, `%${filters.name}%`),
    filters.majorId && eq(scholarships.major_id, filters.majorId),
    filters.campusId && eq(scholarships.campus_id, filters.campusId),
    filters.minAmount && gte(scholarships.amount, filters.minAmount)
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

