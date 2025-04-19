import { eq, ilike } from 'drizzle-orm';
import { db } from '../db';
import { admissionMethods } from '../db/schema';
import { AdmissionMethod, AdmissionMethodFilterOptions } from '../types/admission-method.types';

/**
 * Lấy tất cả các phương thức xét tuyển với tùy chọn lọc
 * @param filters - Tùy chọn lọc theo tên
 * @returns Mảng các phương thức xét tuyển đã lọc
 */
const getAllAdmissionMethods = async (filters?: AdmissionMethodFilterOptions): Promise<AdmissionMethod[]> => {
  if (!filters || !filters.name) {
    return await db.select().from(admissionMethods);
  }
  
  return await db.select()
    .from(admissionMethods)
    .where(ilike(admissionMethods.name, `%${filters.name}%`));
};

/**
 * Lấy phương thức xét tuyển theo ID
 * @param id - ID của phương thức xét tuyển
 * @returns Đối tượng phương thức xét tuyển nếu tìm thấy, null nếu không
 */
const getAdmissionMethodById = async (id: number): Promise<AdmissionMethod | null> => {
  const result = await db.select()
    .from(admissionMethods)
    .where(eq(admissionMethods.id, id));
    
  return result.length > 0 ? result[0] : null;
};

export const admissionMethodService = {
  getAllAdmissionMethods,
  getAdmissionMethodById,
};
