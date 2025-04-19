import { eq, ilike, or, SQL } from 'drizzle-orm';
import { db } from '../db';
import { majors } from '../db/schema';
import { Major, MajorFilterOptions } from '../types/major.types';
import { NotFoundError } from '../utils/errors';

export const getAllMajors = async (filters?: MajorFilterOptions): Promise<Major[]> => {
  // Nếu không có filter, trả về tất cả
  if (!filters) {
    return await db.query.majors.findMany({
      orderBy: majors.name
    });
  }
  
  // Xây dựng điều kiện tìm kiếm
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
  
  // Nếu không có điều kiện nào, trả về tất cả
  if (conditions.length === 0) {
    return await db.query.majors.findMany({
      orderBy: majors.name
    });
  }
  
  // Thực hiện truy vấn với điều kiện
  return await db.query.majors.findMany({
    where: or(...conditions),
    orderBy: majors.name
  });
};

export const getMajorById = async (id: number): Promise<Major> => {
  const result = await db.query.majors.findFirst({
    where: eq(majors.id, id)
  });
  
  if (!result) {
    throw new NotFoundError('Major', id);
  }
  
  return result;
};

export const getMajorsByCampusId = async (campusId: number): Promise<Major[]> => {
  // TODO: Implement this function when the relationship is established
  throw new Error('Not implemented');
};

export const createMajor = async (data: Omit<Major, 'id'>): Promise<Major> => {
  const [newMajor] = await db.insert(majors)
    .values(data)
    .returning();
  
  return newMajor;
};

export const updateMajor = async (id: number, data: Partial<Omit<Major, 'id'>>): Promise<Major> => {
  // Kiểm tra xem major có tồn tại không
  await getMajorById(id);
  
  const [updatedMajor] = await db.update(majors)
    .set(data)
    .where(eq(majors.id, id))
    .returning();
  
  if (!updatedMajor) {
    throw new NotFoundError('Major', id);
  }
  
  return updatedMajor;
};

export const deleteMajor = async (id: number): Promise<void> => {
  // Kiểm tra xem major có tồn tại không
  await getMajorById(id);
  
  await db.delete(majors)
    .where(eq(majors.id, id));
};

