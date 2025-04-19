import { admissionMethods } from "../db/schema";
import { BaseFilterOptions } from "./common.types";

/**
 * Admission method entity data type
 */
export type AdmissionMethod = typeof admissionMethods.$inferSelect;

/**
 * Filter options for admission method entities
 */
export interface AdmissionMethodFilterOptions extends BaseFilterOptions {
}
