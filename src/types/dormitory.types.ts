import { dormitories, campuses } from "../db/schema";

// Type cho dữ liệu campus
type Campus = {
  id: number;
  name: string;
  address: string | null;
};

// Type cho dữ liệu dormitory
export type Dormitory = typeof dormitories.$inferSelect & {
  campus?: Campus;
};

// Interface cho các tùy chọn lọc
export interface DormitoryFilterOptions {
  name?: string;
  campusId?: number;
  priceMin?: number;
  priceMax?: number;
}
