import { admissionMethods, admissionMethodApplications, majors } from "../db/schema";

// Using type inference from Drizzle ORM schema
type Major = typeof majors.$inferSelect;

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

// Note: AdmissionMethodFilterOptions has been replaced by AdmissionMethodQueryParams from Zod schema
