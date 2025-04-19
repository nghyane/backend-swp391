import { db } from "../db";
import { dormitories, campuses } from "../db/schema";
import { eq, and, like, sql, SQL } from "drizzle-orm";
import { Dormitory, DormitoryFilterOptions } from "../types/dormitory.types";

/**
 * Lấy danh sách ký túc xá với các tùy chọn lọc
 * @param filterOptions - Các tùy chọn lọc (tên, campus, giá...)
 * @returns Danh sách ký túc xá thỏa mãn điều kiện lọc
 */
export const getAllDormitories = async (filterOptions: DormitoryFilterOptions = {}): Promise<Dormitory[]> => {
  try {
    // Xây dựng điều kiện lọc
    const conditions: SQL[] = [];
    
    if (filterOptions.name) {
      conditions.push(like(dormitories.name, `%${filterOptions.name}%`));
    }
    
    if (filterOptions.campusId) {
      conditions.push(eq(dormitories.campus_id, filterOptions.campusId));
    }
    
    // Sử dụng API db.query
    const results = await db
      .select({
        id: dormitories.id,
        campus_id: dormitories.campus_id,
        name: dormitories.name,
        description: dormitories.description,
        capacity: dormitories.capacity,
        campus: {
          id: campuses.id,
          name: campuses.name,
          address: campuses.address
        }
      })
      .from(dormitories)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .innerJoin(campuses, eq(dormitories.campus_id, campuses.id));
    
    // Chuyển đổi kết quả thành mảng Dormitory
    return results;
  } catch (error) {
    console.error("Error getting dormitories:", error);
    throw new Error("Failed to retrieve dormitories");
  }
};

/**
 * Lấy thông tin ký túc xá theo ID
 * @param id - ID của ký túc xá
 * @returns Thông tin ký túc xá hoặc null nếu không tìm thấy
 */
export const getDormitoryById = async (id: number): Promise<Dormitory | null> => {
  try {
    // Sử dụng API select
    const result = await db
      .select({
        id: dormitories.id,
        campus_id: dormitories.campus_id,
        name: dormitories.name,
        description: dormitories.description,
        capacity: dormitories.capacity,
        campus: {
          id: campuses.id,
          name: campuses.name,
          address: campuses.address
        }
      })
      .from(dormitories)
      .where(eq(dormitories.id, id))
      .innerJoin(campuses, eq(dormitories.campus_id, campuses.id));
    
    if (result.length === 0) return null;
    
    return result[0];
  } catch (error) {
    console.error("Error getting dormitory by ID:", error);
    throw new Error("Failed to retrieve dormitory");
  }
};
