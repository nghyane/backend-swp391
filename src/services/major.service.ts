import { eq } from 'drizzle-orm';
import { db } from '../db';
import { majors } from '../db/schema';

/**
 * Get all majors
 * @returns Array of all majors
 */
const getAllMajors = async () => {
  // Lấy tất cả ngành học
  const result = await db.select().from(majors);
  return result;
};

/**
 * Get a major by its ID
 * @param id - Major ID to retrieve
 * @returns Major object if found, null otherwise
 */
const getMajorById = async (id: number) => {
  // Tìm ngành học theo ID
  const result = await db.select().from(majors)
    .where(eq(majors.id, id));
    
  // Trả về ngành học đầu tiên hoặc null nếu không tìm thấy
  return result.length > 0 ? result[0] : null;
};

export const majorService = {
  getAllMajors,
  getMajorById,
};

