import { eq, ilike, or, SQL } from 'drizzle-orm';
import { db } from '../db';
import { campuses } from '../db/schema';
import { CampusFilterOptions, Campus } from '../types/campus.types';

/**
 * Get all campuses with optional filtering
 * @param filters - Optional filters for name and address
 * @returns Array of filtered campuses
 */
const getAllCampuses = async (filters?: CampusFilterOptions): Promise<Campus[]> => {
  if (!filters || (!filters.name && !filters.address)) {
    return await db.select().from(campuses);
  }
  
  const conditions: SQL[] = [];
  
  if (filters.name) {
    conditions.push(ilike(campuses.name, `%${filters.name}%`));
  }
  
  if (filters.address) {
    conditions.push(ilike(campuses.address, `%${filters.address}%`));
  }
  
  return await db.select().from(campuses).where(or(...conditions));
};

/**
 * Get a campus by its ID
 * @param id - Campus ID to retrieve
 * @returns Campus object if found, null otherwise
 */
const getCampusById = async (id: number): Promise<Campus | null> => {
  const result = await db.select().from(campuses)
    .where(eq(campuses.id, id));
    
  return result.length > 0 ? result[0] : null;
};

export const campusService = {
  getAllCampuses,
  getCampusById,
};
