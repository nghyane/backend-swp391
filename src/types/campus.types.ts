import { campuses } from "../db/schema";
import { BaseFilterOptions } from "./common.types";

/**
 * Filter options for campus entities
 */
export interface CampusFilterOptions extends BaseFilterOptions {
  address?: string;
}

/**
 * Campus entity data type
 */
export type Campus = typeof campuses.$inferSelect;
