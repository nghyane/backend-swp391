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
    const filters = [];
    
    if (filterOptions.name) {
      filters.push(like(dormitories.name, `%${filterOptions.name}%`));
    }
    
    if (filterOptions.campusId) {
      filters.push(eq(dormitories.campus_id, filterOptions.campusId));
    }
    
    // Sử dụng API db.query.find
    return await db.query.dormitories.findMany({
      where: filters.length > 0 ? and(...filters) : undefined,
      with: {
        campus: true
      }
    });
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
    // Sử dụng API db.query.find
    const result = await db.query.dormitories.findFirst({
      where: eq(dormitories.id, id),
      with: {
        campus: true
      }
    });
    
    // Chuyển đổi undefined thành null để phù hợp với kiểu trả về
    return result || null;
  } catch (error) {
    console.error("Error getting dormitory by ID:", error);
    throw new Error("Failed to retrieve dormitory");
  }
};
