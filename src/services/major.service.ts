import { eq, ilike, or, SQL } from 'drizzle-orm';
import { db } from '../db';
import { majors } from '../db/schema';
import { Major, MajorFilterOptions } from '../types/major.types';

/**
 * Get all majors with optional filtering
 * @param filters - Optional filters for name, code, and description
 * @returns Array of filtered majors
 */
const getAllMajors = async (filters?: MajorFilterOptions): Promise<Major[]> => {
  if (!filters || (!filters.name && !filters.code && !filters.description)) {
    return await db.select().from(majors);
  }
  
  const conditions: SQL[] = [];
  
  if (filters.name) {
    conditions.push(ilike(majors.name, `%${filters.name}%`));
  }
  
  if (filters.code) {
    conditions.push(ilike(majors.code, `%${filters.code}%`));
  }
  
  if (filters.description) {
    conditions.push(ilike(majors.description, `%${filters.description}%`));
  }
  
  return await db.select().from(majors).where(or(...conditions));
};

/**
 * Get a major by its ID
 * @param id - Major ID to retrieve
 * @returns Major object if found, null otherwise
 */
const getMajorById = async (id: number): Promise<Major | null> => {
  const result = await db.select().from(majors)
    .where(eq(majors.id, id));
    
  return result.length > 0 ? result[0] : null;
};

export const majorService = {
  getAllMajors,
  getMajorById,
};

