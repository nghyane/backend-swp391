import { campuses } from "../db/schema";
/**
 * Interface for campus filter options
 */
export interface CampusFilterOptions {
  name?: string;
  address?: string;
}

/**
 * Interface for campus data
 */
export type Campus = typeof campuses.$inferSelect;
