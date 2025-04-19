import { eq, ilike, and, SQL } from 'drizzle-orm';
import { db } from '../db';
import { admissionMethods } from '../db/schema';
import { AdmissionMethod, AdmissionMethodFilterOptions } from '../types/admission-method.types';
import { NotFoundError } from '../utils/errors';

const DEFAULT_QUERY_OPTIONS = {
  orderBy: admissionMethods.name
};

export const getAllAdmissionMethods = async (filters?: AdmissionMethodFilterOptions): Promise<AdmissionMethod[]> => {
  if (!filters || Object.keys(filters).length === 0) {
    return await db.query.admissionMethods.findMany(DEFAULT_QUERY_OPTIONS);
  }
  
  const conditions: SQL[] = [
    filters.name && ilike(admissionMethods.name, `%${filters.name}%`)
  ].filter(Boolean) as SQL[];
  
  if (conditions.length === 0) {
    return await db.query.admissionMethods.findMany(DEFAULT_QUERY_OPTIONS);
  }
  
  return await db.query.admissionMethods.findMany({
    ...DEFAULT_QUERY_OPTIONS,
    where: and(...conditions)
  });
};

export const getAdmissionMethodById = async (id: number): Promise<AdmissionMethod> => {
  const result = await db.query.admissionMethods.findFirst({
    where: eq(admissionMethods.id, id)
  });
  if (!result) throw new NotFoundError('AdmissionMethod', id);
  return result;
};

export const createAdmissionMethod = async (data: Omit<AdmissionMethod, 'id'>): Promise<AdmissionMethod> => {
  const [newAdmissionMethod] = await db.insert(admissionMethods).values(data).returning();
  return newAdmissionMethod;
};

export const updateAdmissionMethod = async (id: number, data: Partial<Omit<AdmissionMethod, 'id'>>): Promise<AdmissionMethod> => {
  await getAdmissionMethodById(id);
  
  const [updatedAdmissionMethod] = await db.update(admissionMethods)
    .set(data)
    .where(eq(admissionMethods.id, id))
    .returning();
  if (!updatedAdmissionMethod) throw new NotFoundError('AdmissionMethod', id);
  
  return updatedAdmissionMethod;
};

export const deleteAdmissionMethod = async (id: number): Promise<void> => {
  await getAdmissionMethodById(id);
  await db.delete(admissionMethods).where(eq(admissionMethods.id, id));
};

export const getAdmissionMethodsByMajorId = async (majorId: number): Promise<AdmissionMethod[]> => {
  // TODO: Implement this function when the relationship is established
  throw new Error('Not implemented');
};

export const getAdmissionMethodRequirements = async (admissionMethodId: number): Promise<unknown> => {
  // TODO: Implement this function when the requirements schema is defined
  throw new Error('Not implemented');
};

