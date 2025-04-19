import { eq, ilike, and, gte } from 'drizzle-orm';
import { db } from '../db';
import { scholarships } from '../db/schema';
import { Scholarship, ScholarshipFilterOptions } from '../types/scholarship.types';

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
  
  return await db.query.scholarships.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
    with: {
      major: true,
      campus: true
    }
  });
};

export const scholarshipService = {
  getAllScholarships
};
