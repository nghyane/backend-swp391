import { eq, ilike } from 'drizzle-orm';
import { db } from '../db';
import { admissionMethods } from '../db/schema';
import { AdmissionMethod, AdmissionMethodFilterOptions } from '../types/admission-method.types';

const getAllAdmissionMethods = async (filters?: AdmissionMethodFilterOptions): Promise<AdmissionMethod[]> => {
  if (!filters || !filters.name) {
    return await db.query.admissionMethods.findMany();
  }
  
  return await db.query.admissionMethods.findMany({
    where: ilike(admissionMethods.name, `%${filters.name}%`)
  });
};

const getAdmissionMethodById = async (id: number): Promise<AdmissionMethod | null> => {
  const result = await db.query.admissionMethods.findFirst({
    where: eq(admissionMethods.id, id)
  });
  
  return result ?? null;
};

export const admissionMethodService = {
  getAllAdmissionMethods,
  getAdmissionMethodById,
};
