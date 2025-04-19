import { eq, ilike, or, SQL } from 'drizzle-orm';
import { db } from '../db';
import { majors, majorCampusAdmission } from '../db/schema';
import { Major, MajorFilterOptions } from '../types/major.types';
import { NotFoundError } from '../utils/errors';

const DEFAULT_QUERY_OPTIONS = {
  orderBy: majors.id,
  with: {
    majorCampusAdmissions: {
      with: {
        campus: true as const,
        academicYear: true as const
      }
    },
    careers: true as const,
    scholarships: {
      with: {
        campus: true as const
      }
    }
  }
};

const RELATIONS_WITH_CAMPUS = {
  major: true as const
};

export const getAllMajors = async (filters?: MajorFilterOptions): Promise<Major[]> => {
  if (!filters || Object.keys(filters).length === 0) {
    return await db.query.majors.findMany({
      ...DEFAULT_QUERY_OPTIONS,
    });
  }

  const conditions: SQL[] = [
    filters.name && ilike(majors.name, `%${filters.name}%`),
    filters.code && ilike(majors.code, `%${filters.code}%`),
    filters.description && ilike(majors.description, `%${filters.description}%`)
  ].filter(Boolean) as SQL[];

  return await db.query.majors.findMany({
    ...DEFAULT_QUERY_OPTIONS,
    where: conditions.length > 0 ? or(...conditions) : undefined
  });
};

export const getMajorById = async (id: number): Promise<Major> => {
  const result = await db.query.majors.findFirst({
    where: eq(majors.id, id)
  });
  if (!result) throw new NotFoundError('Major', id);
  return result;
};

export const getMajorsByCampusId = async (campusId: number): Promise<Major[]> => {
  const result = await db.query.majorCampusAdmission.findMany({
    where: eq(majorCampusAdmission.campus_id, campusId),
    with: RELATIONS_WITH_CAMPUS
  });
  return result.map(item => item.major);
};

export const createMajor = async (data: Omit<Major, 'id'>): Promise<Major> => {
  const [newMajor] = await db.insert(majors).values(data).returning();
  return newMajor;
};

export const updateMajor = async (id: number, data: Partial<Omit<Major, 'id'>>): Promise<Major> => {
  await getMajorById(id);

  const [updatedMajor] = await db.update(majors)
    .set(data)
    .where(eq(majors.id, id))
    .returning();
  if (!updatedMajor) throw new NotFoundError('Major', id);
  return updatedMajor;
};

export const deleteMajor = async (id: number): Promise<void> => {
  await getMajorById(id);
  await db.delete(majors).where(eq(majors.id, id));
};

