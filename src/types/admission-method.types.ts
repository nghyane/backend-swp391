import { admissionMethods, admissionMethodApplications } from "../db/schema";
import { BaseFilterOptions } from "./common.types";
import { Major } from "./major.types";

/**
 * Admission method entity data type
 */
export type AdmissionMethod = typeof admissionMethods.$inferSelect;

/**
 * Admission method with related major data
 */
export type AdmissionMethodWithMajor = AdmissionMethod & {
  major: Major;
};

/**
 * Admission method application data type
 */
export type AdmissionMethodApplication = typeof admissionMethodApplications.$inferSelect;

/**
 * Admission method application with related entities
 */
export type AdmissionMethodApplicationWithRelations = AdmissionMethodApplication & {
  admissionMethod: AdmissionMethod;
  major?: Major;
};

/**
 * Filter options for admission method entities
 */
export interface AdmissionMethodFilterOptions extends BaseFilterOptions {
}
