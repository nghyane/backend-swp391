import { eq, ilike, or, SQL } from 'drizzle-orm';
import { db } from '../db';
import { majors } from '../db/schema';
import { Major, MajorFilterOptions } from '../types/major.types';
import { NotFoundError } from '../utils/errors';

const getAllMajors = async (filters?: MajorFilterOptions): Promise<Major[]> => {
  if (!filters || (!filters.name && !filters.code && !filters.description)) {
    return await db.query.majors.findMany();
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
  
  return await db.query.majors.findMany({
    where: or(...conditions)
  });
};

const getMajorById = async (id: number): Promise<Major> => {
  const result = await db.query.majors.findFirst({
    where: eq(majors.id, id)
  });
  
  if (!result) {
    throw new NotFoundError('Major', id);
  }
  
  return result;
};

export const majorService = {
  getAllMajors,
  getMajorById,
};

