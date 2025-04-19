import { db } from "../db";
import { dormitories, campuses } from "../db/schema";
import { eq, and, gte, lte, like } from "drizzle-orm";
import { Dormitory, DormitoryFilterOptions } from "../types/dormitory.types";

/**
 * Lấy danh sách ký túc xá với các tùy chọn lọc
 * @param filterOptions - Các tùy chọn lọc (tên, campus, giá...)
 * @returns Danh sách ký túc xá thỏa mãn điều kiện lọc
 */
export const getAllDormitories = async (filterOptions: DormitoryFilterOptions = {}): Promise<Dormitory[]> => {
  try {
    // Xây dựng điều kiện lọc
    const conditions = [];
    if (filterOptions.name) conditions.push(like(dormitories.name, `%${filterOptions.name}%`));
    if (filterOptions.campusId) conditions.push(eq(dormitories.campus_id, filterOptions.campusId));
    
    // Truy vấn dữ liệu với campus
    const results = await db
      .select({
        id: dormitories.id,
        campus_id: dormitories.campus_id,
        name: dormitories.name,
        description: dormitories.description,
        capacity: dormitories.capacity,
        campus_id_ref: campuses.id,
        campus_name: campuses.name,
        campus_address: campuses.address
      })
      .from(dormitories)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .innerJoin(campuses, eq(dormitories.campus_id, campuses.id));
    
    // Chuyển đổi kết quả
    return results.map(item => ({
      id: item.id,
      campus_id: item.campus_id,
      name: item.name,
      description: item.description,
      capacity: item.capacity,
      campus: {
        id: item.campus_id_ref,
        name: item.campus_name,
        address: item.campus_address
      }
    }));
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
    const result = await db
      .select({
        id: dormitories.id,
        campus_id: dormitories.campus_id,
        name: dormitories.name,
        description: dormitories.description,
        capacity: dormitories.capacity,
        campus_id_ref: campuses.id,
        campus_name: campuses.name,
        campus_address: campuses.address
      })
      .from(dormitories)
      .where(eq(dormitories.id, id))
      .innerJoin(campuses, eq(dormitories.campus_id, campuses.id));
    
    if (result.length === 0) return null;
    
    const item = result[0];
    return {
      id: item.id,
      campus_id: item.campus_id,
      name: item.name,
      description: item.description,
      capacity: item.capacity,
      campus: {
        id: item.campus_id_ref,
        name: item.campus_name,
        address: item.campus_address
      }
    };
  } catch (error) {
    console.error("Error getting dormitory by ID:", error);
    throw new Error("Failed to retrieve dormitory");
  }
};
