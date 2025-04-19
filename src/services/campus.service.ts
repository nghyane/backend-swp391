import { eq } from 'drizzle-orm';
import { db } from '../db';
import { campuses } from '../db/schema';

/**
 * Get all campuses
 * @returns Array of all campuses
 */
const getAllCampuses = async () => {
  // Lấy tất cả cơ sở đào tạo
  const result = await db.select().from(campuses);
  return result;
};

/**
 * Get a campus by its ID
 * @param id - Campus ID to retrieve
 * @returns Campus object if found, null otherwise
 */
const getCampusById = async (id: number) => {
  // Tìm cơ sở đào tạo theo ID
  const result = await db.select().from(campuses)
    .where(eq(campuses.id, id));
    
  // Trả về cơ sở đào tạo đầu tiên hoặc null nếu không tìm thấy
  return result.length > 0 ? result[0] : null;
};

export const campusService = {
  getAllCampuses,
  getCampusById,
};
