import { db } from "../db";
import { dormitories, campuses } from "../db/schema";
import { eq, and, like, sql, SQL } from "drizzle-orm";
import { Dormitory, DormitoryFilterOptions } from "../types/dormitory.types";
import { NotFoundError } from "../utils/errors";

export const getAllDormitories = async (filterOptions: DormitoryFilterOptions = {}): Promise<Dormitory[]> => {
  const filters = [];
  
  if (filterOptions.name) {
    filters.push(like(dormitories.name, `%${filterOptions.name}%`));
  }
  
  if (filterOptions.campusId) {
    filters.push(eq(dormitories.campus_id, filterOptions.campusId));
  }
  
  return await db.query.dormitories.findMany({
    where: filters.length > 0 ? and(...filters) : undefined,
    with: {
      campus: true
    }
  });
};

export const getDormitoryById = async (id: number): Promise<Dormitory> => {
  const result = await db.query.dormitories.findFirst({
    where: eq(dormitories.id, id),
    with: {
      campus: true
    }
  });
  
  if (!result) {
    throw new NotFoundError("Dormitory", id);
  }
  
  return result;
};
