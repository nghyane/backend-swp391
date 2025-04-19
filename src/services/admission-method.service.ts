import { eq, ilike, and, SQL } from 'drizzle-orm';
import { db } from '../db';
import { admissionMethods } from '../db/schema';
import { AdmissionMethod, AdmissionMethodFilterOptions } from '../types/admission-method.types';
import { NotFoundError } from '../utils/errors';

export const getAllAdmissionMethods = async (filters?: AdmissionMethodFilterOptions): Promise<AdmissionMethod[]> => {
  // Nếu không có filter, trả về tất cả
  if (!filters) {
    return await db.query.admissionMethods.findMany({
      orderBy: admissionMethods.name
    });
  }
  
  // Xây dựng điều kiện tìm kiếm
  const conditions: SQL[] = [];
  
  if (filters.name) {
    conditions.push(ilike(admissionMethods.name, `%${filters.name}%`));
  }
  
  // Nếu không có điều kiện nào, trả về tất cả
  if (conditions.length === 0) {
    return await db.query.admissionMethods.findMany({
      orderBy: admissionMethods.name
    });
  }
  
  // Thực hiện truy vấn với điều kiện
  return await db.query.admissionMethods.findMany({
    where: and(...conditions),
    orderBy: admissionMethods.name
  });
};

export const getAdmissionMethodById = async (id: number): Promise<AdmissionMethod> => {
  const result = await db.query.admissionMethods.findFirst({
    where: eq(admissionMethods.id, id)
  });
  
  if (!result) {
    throw new NotFoundError('AdmissionMethod', id);
  }
  
  return result;
};

export const createAdmissionMethod = async (data: Omit<AdmissionMethod, 'id'>): Promise<AdmissionMethod> => {
  const [newAdmissionMethod] = await db.insert(admissionMethods)
    .values(data)
    .returning();
  
  return newAdmissionMethod;
};

export const updateAdmissionMethod = async (id: number, data: Partial<Omit<AdmissionMethod, 'id'>>): Promise<AdmissionMethod> => {
  // Kiểm tra xem admission method có tồn tại không
  await getAdmissionMethodById(id);
  
  const [updatedAdmissionMethod] = await db.update(admissionMethods)
    .set(data)
    .where(eq(admissionMethods.id, id))
    .returning();
  
  if (!updatedAdmissionMethod) {
    throw new NotFoundError('AdmissionMethod', id);
  }
  
  return updatedAdmissionMethod;
};

export const deleteAdmissionMethod = async (id: number): Promise<void> => {
  // Kiểm tra xem admission method có tồn tại không
  await getAdmissionMethodById(id);
  
  await db.delete(admissionMethods)
    .where(eq(admissionMethods.id, id));
};

export const getAdmissionMethodsByMajorId = async (majorId: number): Promise<AdmissionMethod[]> => {
  // TODO: Implement this function when the relationship is established
  throw new Error('Not implemented');
};

export const getAdmissionMethodRequirements = async (admissionMethodId: number): Promise<unknown> => {
  // TODO: Implement this function when the requirements schema is defined
  throw new Error('Not implemented');
};

