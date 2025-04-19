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
    
    // Lọc theo tên
    if (filterOptions.name) {
      conditions.push(like(dormitories.name, `%${filterOptions.name}%`));
    }
    
    // Lọc theo campus
    if (filterOptions.campusId) {
      conditions.push(eq(dormitories.campus_id, filterOptions.campusId));
    }
    
    // Truy vấn dữ liệu - luôn join với campus
    const dormitoryList = await db
      .select({
        dormitory: dormitories,
        campus: campuses
      })
      .from(dormitories)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .innerJoin(campuses, eq(dormitories.campus_id, campuses.id));
    
    // Chuyển đổi kết quả thành mảng Dormitory
    return dormitoryList.map(item => {
      const dormitory: Dormitory = {
        id: item.dormitory.id,
        campus_id: item.dormitory.campus_id,
        name: item.dormitory.name,
        description: item.dormitory.description,
        capacity: item.dormitory.capacity,
        // Luôn bao gồm thông tin campus
        campus: {
          id: item.campus.id,
          name: item.campus.name,
          address: item.campus.address
        }
      };
      
      return dormitory;
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
    const result = await db
      .select({
        dormitory: dormitories,
        campus: campuses
      })
      .from(dormitories)
      .where(eq(dormitories.id, id))
      .innerJoin(campuses, eq(dormitories.campus_id, campuses.id));
    
    if (result.length === 0) {
      return null;
    }
    
    const item = result[0];
    const dormitory: Dormitory = {
      id: item.dormitory.id,
      campus_id: item.dormitory.campus_id,
      name: item.dormitory.name,
      description: item.dormitory.description,
      capacity: item.dormitory.capacity,
      // Luôn bao gồm thông tin campus
      campus: {
        id: item.campus.id,
        name: item.campus.name,
        address: item.campus.address
      }
    };
    
    return dormitory;
  } catch (error) {
    console.error("Error getting dormitory by ID:", error);
    throw new Error("Failed to retrieve dormitory");
  }
};
