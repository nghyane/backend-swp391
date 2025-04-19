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

const createCampus = async (data: Omit<Campus, 'id'>): Promise<Campus> => {
  const [newCampus] = await db.insert(campuses)
    .values(data)
    .returning();
  
  return newCampus;
};

const updateCampus = async (id: number, data: Partial<Omit<Campus, 'id'>>): Promise<Campus> => {
  await getCampusById(id);
  
  const [updatedCampus] = await db.update(campuses)
    .set(data)
    .where(eq(campuses.id, id))
    .returning();
  
  if (!updatedCampus) {
    throw new NotFoundError('Campus', id);
  }
  
  return updatedCampus;
};

const deleteCampus = async (id: number): Promise<void> => {
  await getCampusById(id);
  
  await db.delete(campuses)
    .where(eq(campuses.id, id));
};

const getCampusMajors = async (campusId: number): Promise<unknown> => {
  throw new Error('Not implemented');
};

const getCampusFacilities = async (campusId: number): Promise<unknown> => {
  throw new Error('Not implemented');
};

export const campusService = {
  getAllCampuses,
  getCampusById,
  createCampus,
  updateCampus,
  deleteCampus,
  getCampusMajors,
  getCampusFacilities
};
