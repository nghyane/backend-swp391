import { eq, ilike, or, SQL } from 'drizzle-orm';
import { db } from '../db';
import { campuses } from '../db/schema';
import { CampusFilterOptions, Campus } from '../types/campus.types';
import { NotFoundError } from '../utils/errors';

export const getAllCampuses = async (filters?: CampusFilterOptions): Promise<Campus[]> => {
  // Nếu không có filter, trả về tất cả
  if (!filters) {
    return await db.query.campuses.findMany({
      orderBy: campuses.name
    });
  }
  
  // Xây dựng điều kiện tìm kiếm
  const conditions: SQL[] = [];
  
  if (filters.name) {
    conditions.push(ilike(campuses.name, `%${filters.name}%`));
  }
  
  if (filters.address) {
    conditions.push(ilike(campuses.address, `%${filters.address}%`));
  }
  
  // Nếu không có điều kiện nào, trả về tất cả
  if (conditions.length === 0) {
    return await db.query.campuses.findMany({
      orderBy: campuses.name
    });
  }
  
  // Thực hiện truy vấn với điều kiện
  return await db.query.campuses.findMany({
    where: or(...conditions),
    orderBy: campuses.name
  });
};

export const getCampusById = async (id: number): Promise<Campus> => {
  const result = await db.query.campuses.findFirst({
    where: eq(campuses.id, id)
  });
  
  if (!result) {
    throw new NotFoundError('Campus', id);
  }
  
  return result;
};

export const createCampus = async (data: Omit<Campus, 'id'>): Promise<Campus> => {
  const [newCampus] = await db.insert(campuses)
    .values(data)
    .returning();
  
  return newCampus;
};

export const updateCampus = async (id: number, data: Partial<Omit<Campus, 'id'>>): Promise<Campus> => {
  // Kiểm tra xem campus có tồn tại không
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

export const deleteCampus = async (id: number): Promise<void> => {
  // Kiểm tra xem campus có tồn tại không
  await getCampusById(id);
  
  await db.delete(campuses)
    .where(eq(campuses.id, id));
};

export const getCampusMajors = async (campusId: number): Promise<unknown> => {
  // TODO: Implement this function when the relationship is established
  throw new Error('Not implemented');
};

export const getCampusFacilities = async (campusId: number): Promise<unknown> => {
  // TODO: Implement this function when the facilities schema is defined
  throw new Error('Not implemented');
};

