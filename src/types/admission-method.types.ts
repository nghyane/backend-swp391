import { admissionMethods } from "../db/schema";

/**
 * Type for admission method data
 */
export type AdmissionMethod = typeof admissionMethods.$inferSelect;

/**
 * Interface for admission method filter options
 */
export interface AdmissionMethodFilterOptions {
  name?: string;
}
