import { eq, ilike, and, gte, SQL } from 'drizzle-orm';
import { db } from '../db';
import { scholarships } from '../db/schema';
import { Scholarship, ScholarshipFilterOptions } from '../types/scholarship.types';
import { NotFoundError } from '../utils/errors';

export const getAllScholarships = async (filters?: ScholarshipFilterOptions): Promise<Scholarship[]> => {
  // Xây dựng điều kiện tìm kiếm
  const conditions: SQL[] = [];
  
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
    },
    orderBy: scholarships.name
  });
};

export const getScholarshipById = async (id: number): Promise<Scholarship> => {
  const result = await db.query.scholarships.findFirst({
    where: eq(scholarships.id, id),
    with: {
      major: true,
      campus: true
    }
  });
  
  if (!result) {
    throw new NotFoundError('Scholarship', id);
  }
  
  return result;
};

export const getScholarshipsByMajorId = async (majorId: number): Promise<Scholarship[]> => {
  return await db.query.scholarships.findMany({
    where: eq(scholarships.major_id, majorId),
    with: {
      major: true,
      campus: true
    },
    orderBy: scholarships.amount
  });
};

export const getScholarshipsByCampusId = async (campusId: number): Promise<Scholarship[]> => {
  return await db.query.scholarships.findMany({
    where: eq(scholarships.campus_id, campusId),
    with: {
      major: true,
      campus: true
    },
    orderBy: scholarships.amount
  });
};

export const getScholarshipsByEligibility = async (criteria: Record<string, any>): Promise<Scholarship[]> => {
  // TODO: Implement this function when eligibility criteria are defined
  throw new Error('Not implemented');
};

