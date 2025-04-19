import { dormitories } from "../db/schema";
import { Campus } from "./campus.types";
import { BaseFilterOptions } from "./common.types";

/**
 * Dormitory entity data type with campus information
 */
export type Dormitory = typeof dormitories.$inferSelect & {
  campus: Campus; // Campus is required
};

/**
 * Filter options for dormitory entities
 */
export interface DormitoryFilterOptions extends BaseFilterOptions {
  campusId?: number;
  priceMin?: number;
  priceMax?: number;
}
