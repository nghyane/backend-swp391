import { eq, ilike } from 'drizzle-orm';
import { db } from '../db';
import { admissionMethods } from '../db/schema';
import { AdmissionMethod, AdmissionMethodFilterOptions } from '../types/admission-method.types';
import { NotFoundError } from '../utils/errors';

const getAllAdmissionMethods = async (filters?: AdmissionMethodFilterOptions): Promise<AdmissionMethod[]> => {
  if (!filters || !filters.name) {
    return await db.query.admissionMethods.findMany();
  }
  
  return await db.query.admissionMethods.findMany({
    where: ilike(admissionMethods.name, `%${filters.name}%`)
  });
};

const getAdmissionMethodById = async (id: number): Promise<AdmissionMethod> => {
  const result = await db.query.admissionMethods.findFirst({
    where: eq(admissionMethods.id, id)
  });
  
  if (!result) {
    throw new NotFoundError('AdmissionMethod', id);
  }
  
  return result;
};

const createAdmissionMethod = async (data: Omit<AdmissionMethod, 'id'>): Promise<AdmissionMethod> => {
  const [newAdmissionMethod] = await db.insert(admissionMethods)
    .values(data)
    .returning();
  
  return newAdmissionMethod;
};

const updateAdmissionMethod = async (id: number, data: Partial<Omit<AdmissionMethod, 'id'>>): Promise<AdmissionMethod> => {
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

const deleteAdmissionMethod = async (id: number): Promise<void> => {
  await getAdmissionMethodById(id);
  
  await db.delete(admissionMethods)
    .where(eq(admissionMethods.id, id));
};

const getAdmissionMethodsByMajorId = async (majorId: number): Promise<AdmissionMethod[]> => {
  throw new Error('Not implemented');
};

const getAdmissionMethodRequirements = async (admissionMethodId: number): Promise<unknown> => {
  throw new Error('Not implemented');
};

export const admissionMethodService = {
  getAllAdmissionMethods,
  getAdmissionMethodById,
  createAdmissionMethod,
  updateAdmissionMethod,
  deleteAdmissionMethod,
  getAdmissionMethodsByMajorId,
  getAdmissionMethodRequirements
};
