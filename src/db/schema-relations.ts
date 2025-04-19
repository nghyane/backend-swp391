import { relations } from "drizzle-orm";
import { 
  dormitories, 
  campuses, 
  majors, 
  careers, 
  scholarships, 
  majorCampusAdmission, 
  academicYears,
  admissionMethods
} from "./schema";

// Định nghĩa relations cho dormitories
export const dormitoriesRelations = relations(dormitories, ({ one }) => ({
  campus: one(campuses, {
    fields: [dormitories.campus_id],
    references: [campuses.id],
  }),
}));

// Định nghĩa relations cho campuses
export const campusesRelations = relations(campuses, ({ many }) => ({
  dormitories: many(dormitories),
  majorCampusAdmissions: many(majorCampusAdmission),
  scholarships: many(scholarships),
}));

// Định nghĩa relations cho majors
export const majorsRelations = relations(majors, ({ many }) => ({
  careers: many(careers),
  majorCampusAdmissions: many(majorCampusAdmission),
  scholarships: many(scholarships),
}));

// Định nghĩa relations cho careers
export const careersRelations = relations(careers, ({ one }) => ({
  major: one(majors, {
    fields: [careers.major_id],
    references: [majors.id],
  }),
}));

// Định nghĩa relations cho scholarships
export const scholarshipsRelations = relations(scholarships, ({ one }) => ({
  major: one(majors, {
    fields: [scholarships.major_id],
    references: [majors.id],
  }),
  campus: one(campuses, {
    fields: [scholarships.campus_id],
    references: [campuses.id],
  }),
}));

// Định nghĩa relations cho majorCampusAdmission
export const majorCampusAdmissionRelations = relations(majorCampusAdmission, ({ one }) => ({
  major: one(majors, {
    fields: [majorCampusAdmission.major_id],
    references: [majors.id],
  }),
  campus: one(campuses, {
    fields: [majorCampusAdmission.campus_id],
    references: [campuses.id],
  }),
  academicYear: one(academicYears, {
    fields: [majorCampusAdmission.academic_year_id],
    references: [academicYears.id],
  }),
}));

// Định nghĩa relations cho academicYears
export const academicYearsRelations = relations(academicYears, ({ many }) => ({
  majorCampusAdmissions: many(majorCampusAdmission),
}));
