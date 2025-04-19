import { eq, ilike, and, gte } from 'drizzle-orm';
import { db } from '../db';
import { scholarships } from '../db/schema';
import { Scholarship, ScholarshipFilterOptions } from '../types/scholarship.types';

/**
 * Lấy tất cả học bổng với tùy chọn lọc
 */
const getAllScholarships = async (filters?: ScholarshipFilterOptions): Promise<Scholarship[]> => {
  const conditions = [];
  
  if (filters?.name) {
    conditions.push(ilike(scholarships.name, `%${filters.name}%`));
  }
  
  if (filters?.majorId) {
    conditions.push(eq(scholarships.major_id, filters.majorId));
  }
  
  if (filters?.campusId) {
    conditions.push(eq(scholarships.campus_id, filters.campusId));
  }
  
  if (filters?.minAmount) {
    conditions.push(gte(scholarships.amount, filters.minAmount));
  }
  
  if (conditions.length > 0) {
    return await db.select().from(scholarships).where(and(...conditions));
  }
  
  return await db.select().from(scholarships);
};

export const scholarshipService = {
  getAllScholarships
};
