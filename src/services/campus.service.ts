import { eq, ilike, or, SQL } from 'drizzle-orm';
import { db } from '../db';
import { campuses } from '../db/schema';
import { CampusFilterOptions, Campus } from '../types/campus.types';
import { NotFoundError } from '../utils/errors';

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

const getCampusById = async (id: number): Promise<Campus> => {
  const result = await db.query.campuses.findFirst({
    where: eq(campuses.id, id)
  });
  
  if (!result) {
    throw new NotFoundError('Campus', id);
  }
  
  return result;
};

export const campusService = {
  getAllCampuses,
  getCampusById,
};
