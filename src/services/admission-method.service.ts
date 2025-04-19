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

export const admissionMethodService = {
  getAllAdmissionMethods,
  getAdmissionMethodById,
};
