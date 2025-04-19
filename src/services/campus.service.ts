import { eq, ilike, or, SQL } from 'drizzle-orm';
import { db } from '../db';
import { campuses } from '../db/schema';
import { CampusFilterOptions, Campus } from '../types/campus.types';
import { NotFoundError } from '../utils/errors';

const DEFAULT_QUERY_OPTIONS = {
  orderBy: campuses.name
};

export const getAllCampuses = async (filters?: CampusFilterOptions): Promise<Campus[]> => {
  if (!filters || Object.keys(filters).length === 0) {
    return await db.query.campuses.findMany(DEFAULT_QUERY_OPTIONS);
  }
  
  const conditions: SQL[] = [
    filters.name && ilike(campuses.name, `%${filters.name}%`),
    filters.address && ilike(campuses.address, `%${filters.address}%`)
  ].filter(Boolean) as SQL[];
  
  if (conditions.length === 0) {
    return await db.query.campuses.findMany(DEFAULT_QUERY_OPTIONS);
  }
  
  return await db.query.campuses.findMany({
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

export const createCampus = async (data: Omit<Campus, 'id'>): Promise<Campus> => {
  const [newCampus] = await db.insert(campuses).values(data).returning();
  return newCampus;
};

export const updateCampus = async (id: number, data: Partial<Omit<Campus, 'id'>>): Promise<Campus> => {
  await getCampusById(id);
  
  const [updatedCampus] = await db.update(campuses)
    .set(data)
    .where(eq(campuses.id, id))
    .returning();
  if (!updatedCampus) throw new NotFoundError('Campus', id);
  
  return updatedCampus;
};

export const deleteCampus = async (id: number): Promise<void> => {
  await getCampusById(id);
  await db.delete(campuses).where(eq(campuses.id, id));
};

export const getCampusMajors = async (campusId: number): Promise<unknown> => {
  // TODO: Implement this function when the relationship is established
  throw new Error('Not implemented');
};

export const getCampusFacilities = async (campusId: number): Promise<unknown> => {
  // TODO: Implement this function when the facilities schema is defined
  throw new Error('Not implemented');
};

