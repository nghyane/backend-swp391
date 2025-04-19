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
    
    // Truy vấn dữ liệu
    const dormitoryList = await db
      .select()
      .from(dormitories)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .leftJoin(campuses, eq(dormitories.campus_id, campuses.id));
    
    // Chuyển đổi kết quả thành mảng Dormitory
    return dormitoryList.map(item => {
      const dormitory: Dormitory = {
        id: item.dormitories.id,
        campus_id: item.dormitories.campus_id,
        name: item.dormitories.name,
        description: item.dormitories.description,
        capacity: item.dormitories.capacity
      };
      
      // Thêm thông tin campus nếu có
      if (item.campuses) {
        dormitory.campus = {
          id: item.campuses.id,
          name: item.campuses.name,
          address: item.campuses.address
        };
      }
      
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
      .select()
      .from(dormitories)
      .where(eq(dormitories.id, id))
      .leftJoin(campuses, eq(dormitories.campus_id, campuses.id));
    
    if (result.length === 0) {
      return null;
    }
    
    const item = result[0];
    const dormitory: Dormitory = {
      id: item.dormitories.id,
      campus_id: item.dormitories.campus_id,
      name: item.dormitories.name,
      description: item.dormitories.description,
      capacity: item.dormitories.capacity
    };
    
    // Thêm thông tin campus nếu có
    if (item.campuses) {
      dormitory.campus = {
        id: item.campuses.id,
        name: item.campuses.name,
        address: item.campuses.address
      };
    }
    
    return dormitory;
  } catch (error) {
    console.error("Error getting dormitory by ID:", error);
    throw new Error("Failed to retrieve dormitory");
  }
};
