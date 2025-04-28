import { relations } from "drizzle-orm";
import {
  dormitories,
  campuses,
  majors,
  careers,
  scholarships,
  majorCampusAdmission,
  academicYears,
  admissionMethods,
  scholarshipAvailability,
  admissionMethodApplications
} from "./schema";

/**
 * Relations of dormitories with other tables
 * - Each dormitory belongs to one campus
 */
export const dormitoriesRelations = relations(dormitories, ({ one }) => ({
  // Managing campus of the dormitory
  campus: one(campuses, {
    fields: [dormitories.campus_id],
    references: [campuses.id],
  }),
}));

/**
 * Relations of campus with other tables
 * - Each campus has many dormitories
 * - Each campus offers many majors by year
 * - Each campus has many applicable scholarships
 */
export const campusesRelations = relations(campuses, ({ many }) => ({
  // List of dormitories belonging to this campus
  dormitories: many(dormitories),
  // List of majors offered by year at this campus
  majorCampusAdmissions: many(majorCampusAdmission),
  // List of scholarships available at this campus
  scholarshipAvailabilities: many(scholarshipAvailability),
}));

/**
 * Relations of majors with other tables
 * - Each major has many career opportunities
 * - Each major is offered at many campuses by year
 * - Each major has many scholarships
 */
export const majorsRelations = relations(majors, ({ many }) => ({
  // List of career opportunities for this major
  careers: many(careers),
  // List of campuses and academic years offering this major
  majorCampusAdmissions: many(majorCampusAdmission),
  // List of scholarships applicable to this major
  scholarshipAvailabilities: many(scholarshipAvailability),
  // List of admission methods for this major
  admissionMethodApplications: many(admissionMethodApplications),
}));

/**
 * Relations of career opportunities with other tables
 * - Each career opportunity belongs to one major
 */
export const careersRelations = relations(careers, ({ one }) => ({
  // Major related to this career opportunity
  major: one(majors, {
    fields: [careers.major_id],
    references: [majors.id],
  }),
}));

/**
 * Relations of scholarships with other tables
 * - Each scholarship may belong to a specific major
 * - Each scholarship may apply to multiple campuses and academic years through the scholarshipAvailability table
 */
export const scholarshipsRelations = relations(scholarships, ({ many }) => ({
  // List of campuses, majors and academic years where this scholarship is available
  availabilities: many(scholarshipAvailability),
}));

/**
 * Relations of the junction table between major, campus and academic year
 * - Connects majors with campuses in each academic year
 * - Stores information about quotas and tuition fees
 */
export const majorCampusAdmissionRelations = relations(majorCampusAdmission, ({ one }) => ({
  // Major being offered
  major: one(majors, {
    fields: [majorCampusAdmission.major_id],
    references: [majors.id],
  }),
  // Campus where the major is offered
  campus: one(campuses, {
    fields: [majorCampusAdmission.campus_id],
    references: [campuses.id],
  }),
  // Academic year
  academicYear: one(academicYears, {
    fields: [majorCampusAdmission.academic_year_id],
    references: [academicYears.id],
  }),
}));

/**
 * Relations of academic years with other tables
 * - Each academic year has many majors offered at various campuses
 * - Each academic year has many admission methods applied
 * - Each academic year has many scholarships provided
 */
export const academicYearsRelations = relations(academicYears, ({ many }) => ({
  // List of majors offered at campuses in this academic year
  majorCampusAdmissions: many(majorCampusAdmission),
  // List of admission methods available in this academic year
  admissionMethodApplications: many(admissionMethodApplications),
  // List of scholarships available in this academic year
  scholarshipAvailabilities: many(scholarshipAvailability),
}));

/**
 * Relations of admission methods with other tables
 * - Each admission method can be applied in different academic years
 */
export const admissionMethodsRelations = relations(admissionMethods, ({ many }) => ({
  // List of applications for this admission method
  applications: many(admissionMethodApplications),
}));

/**
 * Relations of the admission method application table
 * - Connects admission methods with academic years, campuses, and majors (optional)
 * - Allows tracking which admission method is applied in which academic year, at which campus, and for which major
 */
export const admissionMethodApplicationsRelations = relations(admissionMethodApplications, ({ one }) => ({
  // Applied admission method
  admissionMethod: one(admissionMethods, {
    fields: [admissionMethodApplications.admission_method_id],
    references: [admissionMethods.id],
  }),
  // Academic year
  academicYear: one(academicYears, {
    fields: [admissionMethodApplications.academic_year_id],
    references: [academicYears.id],
  }),
  // Applied campus (optional)
  campus: one(campuses, {
    fields: [admissionMethodApplications.campus_id],
    references: [campuses.id],
  }),
  // Applied major (optional)
  major: one(majors, {
    fields: [admissionMethodApplications.major_id],
    references: [majors.id],
  }),
}));

/**
 * Relations of the scholarship availability junction table with other tables
 * - Each record belongs to one scholarship
 * - Each record belongs to one campus
 * - Each record belongs to one academic year
 */
export const scholarshipAvailabilityRelations = relations(scholarshipAvailability, ({ one }) => ({
  // Scholarship
  scholarship: one(scholarships, {
    fields: [scholarshipAvailability.scholarship_id],
    references: [scholarships.id],
  }),
  // Campus
  campus: one(campuses, {
    fields: [scholarshipAvailability.campus_id],
    references: [campuses.id],
  }),
  // Academic year
  academicYear: one(academicYears, {
    fields: [scholarshipAvailability.academic_year_id],
    references: [academicYears.id],
  }),
  // Major (optional)
  major: one(majors, {
    fields: [scholarshipAvailability.major_id],
    references: [majors.id],
  }),
}));


