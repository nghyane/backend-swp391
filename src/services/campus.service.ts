import { eq, ilike, or, SQL } from 'drizzle-orm';
import { db } from '../db';
import { campuses } from '../db/schema';
import { CampusFilterOptions, Campus } from '../types/campus.types';

const getAllCampuses = async (filters?: CampusFilterOptions): Promise<Campus[]> => {
  if (!filters || (!filters.name && !filters.address)) {
    return await db.query.campuses.findMany();
  }
  
  const conditions: SQL[] = [];
  
  if (filters.name) {
    conditions.push(ilike(campuses.name, `%${filters.name}%`));
  }
  
  if (filters.address) {
    conditions.push(ilike(campuses.address, `%${filters.address}%`));
  }
  
  return await db.query.campuses.findMany({
    where: or(...conditions)
  });
};

const getCampusById = async (id: number): Promise<Campus | null> => {
  const result = await db.query.campuses.findFirst({
    where: eq(campuses.id, id)
  });
  
  return result ?? null;
};

export const campusService = {
  getAllCampuses,
  getCampusById,
};
