import { admissionMethods, admissionMethodApplications, majors } from "../db/schema";

// Sử dụng type inference từ Drizzle ORM schema
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

// Lưu ý: AdmissionMethodFilterOptions đã được thay thế bằng AdmissionMethodQueryParams từ Zod schema
