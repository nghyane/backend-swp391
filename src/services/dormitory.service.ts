import { eq, and, like, SQL } from "drizzle-orm";
import { db } from "../db";
import { dormitories, campuses } from "../db/schema";
import { Dormitory, DormitoryFilterOptions } from "../types/dormitory.types";
import { NotFoundError } from "../utils/errors";

const RELATIONS = { campus: true } as const;

const DEFAULT_QUERY_OPTIONS = {
  with: RELATIONS,
  orderBy: dormitories.name
};

export const getAllDormitories = async (filterOptions?: DormitoryFilterOptions): Promise<Dormitory[]> => {
  if (!filterOptions) return await db.query.dormitories.findMany(DEFAULT_QUERY_OPTIONS);
  
  const filters: SQL[] = [];
  if (filterOptions.name) filters.push(like(dormitories.name, `%${filterOptions.name}%`));
  if (filterOptions.campusId) filters.push(eq(dormitories.campus_id, filterOptions.campusId));
  
  if (filters.length === 0) return await db.query.dormitories.findMany(DEFAULT_QUERY_OPTIONS);
  
  return await db.query.dormitories.findMany({
    ...DEFAULT_QUERY_OPTIONS,
    where: and(...filters)
  });
};

export const getDormitoryById = async (id: number): Promise<Dormitory> => {
  const result = await db.query.dormitories.findFirst({
    where: eq(dormitories.id, id),
    with: RELATIONS
  });
  if (!result) throw new NotFoundError("Dormitory", id);
  return result;
};

export const createDormitory = async (data: Omit<Dormitory, 'id' | 'campus'>): Promise<Dormitory> => {
  const campusExists = await db.query.campuses.findFirst({
    where: eq(campuses.id, data.campus_id)
  });
  if (!campusExists) throw new NotFoundError("Campus", data.campus_id);
  
  const [newDormitory] = await db.insert(dormitories).values(data).returning();
  return getDormitoryById(newDormitory.id);
};

export const updateDormitory = async (id: number, data: Partial<Omit<Dormitory, 'id' | 'campus'>>): Promise<Dormitory> => {
  await getDormitoryById(id);
  
  if (data.campus_id) {
    const campusExists = await db.query.campuses.findFirst({
      where: eq(campuses.id, data.campus_id)
    });
    if (!campusExists) throw new NotFoundError("Campus", data.campus_id);
  }
  
  const [updatedDormitory] = await db.update(dormitories)
    .set(data)
    .where(eq(dormitories.id, id))
    .returning();
  if (!updatedDormitory) throw new NotFoundError("Dormitory", id);
  
  return getDormitoryById(updatedDormitory.id);
};

export const deleteDormitory = async (id: number): Promise<void> => {
  await getDormitoryById(id);
  await db.delete(dormitories).where(eq(dormitories.id, id));
};

export const getDormitoriesByCampusId = async (campusId: number): Promise<Dormitory[]> => {
  const campusExists = await db.query.campuses.findFirst({
    where: eq(campuses.id, campusId)
  });
  if (!campusExists) throw new NotFoundError("Campus", campusId);
  
  return await db.query.dormitories.findMany({
    ...DEFAULT_QUERY_OPTIONS,
    where: eq(dormitories.campus_id, campusId)
  });
};
