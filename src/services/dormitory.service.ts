import { db } from "../db";
import { dormitories, campuses } from "../db/schema";
import { eq, and, like, between, gte, lte, SQL } from "drizzle-orm";
import { Dormitory, DormitoryFilterOptions } from "../types/dormitory.types";
import { NotFoundError } from "../utils/errors";

export const getAllDormitories = async (filterOptions?: DormitoryFilterOptions): Promise<Dormitory[]> => {
  // Nếu không có filter, trả về tất cả
  if (!filterOptions) {
    return await db.query.dormitories.findMany({
      with: { campus: true },
      orderBy: dormitories.name
    });
  }
  
  // Xây dựng điều kiện tìm kiếm
  const filters: SQL[] = [];
  
  if (filterOptions.name) {
    filters.push(like(dormitories.name, `%${filterOptions.name}%`));
  }
  
  if (filterOptions.campusId) {
    filters.push(eq(dormitories.campus_id, filterOptions.campusId));
  }
  
  // Lưu ý: Hiện tại schema không có trường price_per_month
  // Các filter giá sẽ được thêm vào khi schema được cập nhật
  // Giữ lại logic filter để sử dụng sau này
  
  // Nếu không có điều kiện nào, trả về tất cả
  if (filters.length === 0) {
    return await db.query.dormitories.findMany({
      with: { campus: true },
      orderBy: dormitories.name
    });
  }
  
  // Thực hiện truy vấn với điều kiện
  return await db.query.dormitories.findMany({
    where: and(...filters),
    with: { campus: true },
    orderBy: dormitories.name
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

export const createDormitory = async (data: Omit<Dormitory, 'id' | 'campus'>): Promise<Dormitory> => {
  // Kiểm tra xem campus có tồn tại không
  const campusExists = await db.query.campuses.findFirst({
    where: eq(campuses.id, data.campus_id)
  });
  
  if (!campusExists) {
    throw new NotFoundError("Campus", data.campus_id);
  }
  
  const [newDormitory] = await db.insert(dormitories)
    .values(data)
    .returning();
  
  return getDormitoryById(newDormitory.id);
};

export const updateDormitory = async (id: number, data: Partial<Omit<Dormitory, 'id' | 'campus'>>): Promise<Dormitory> => {
  // Kiểm tra xem dormitory có tồn tại không
  await getDormitoryById(id);
  
  // Nếu cập nhật campus_id, kiểm tra xem campus có tồn tại không
  if (data.campus_id) {
    const campusExists = await db.query.campuses.findFirst({
      where: eq(campuses.id, data.campus_id)
    });
    
    if (!campusExists) {
      throw new NotFoundError("Campus", data.campus_id);
    }
  }
  
  const [updatedDormitory] = await db.update(dormitories)
    .set(data)
    .where(eq(dormitories.id, id))
    .returning();
  
  if (!updatedDormitory) {
    throw new NotFoundError("Dormitory", id);
  }
  
  return getDormitoryById(updatedDormitory.id);
};

export const deleteDormitory = async (id: number): Promise<void> => {
  // Kiểm tra xem dormitory có tồn tại không
  await getDormitoryById(id);
  
  await db.delete(dormitories)
    .where(eq(dormitories.id, id));
};

export const getDormitoriesByCampusId = async (campusId: number): Promise<Dormitory[]> => {
  // Kiểm tra xem campus có tồn tại không
  const campusExists = await db.query.campuses.findFirst({
    where: eq(campuses.id, campusId)
  });
  
  if (!campusExists) {
    throw new NotFoundError("Campus", campusId);
  }
  
  return await db.query.dormitories.findMany({
    where: eq(dormitories.campus_id, campusId),
    with: { campus: true },
    orderBy: dormitories.name
  });
};
