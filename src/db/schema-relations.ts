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
 * Quan hệ của ký túc xá với các bảng khác
 * - Mỗi ký túc xá thuộc về một campus
 */
export const dormitoriesRelations = relations(dormitories, ({ one }) => ({
  // Managing campus of the dormitory
  campus: one(campuses, {
    fields: [dormitories.campus_id],
    references: [campuses.id],
  }),
}));

/**
 * Quan hệ của campus với các bảng khác
 * - Mỗi campus có nhiều ký túc xá
 * - Mỗi campus có nhiều ngành đào tạo theo từng năm
 * - Mỗi campus có nhiều học bổng áp dụng
 */
export const campusesRelations = relations(campuses, ({ many }) => ({
  // Danh sách ký túc xá thuộc campus
  dormitories: many(dormitories),
  // List of majors offered by year at this campus
  majorCampusAdmissions: many(majorCampusAdmission),
  // List of scholarships available at this campus
  scholarshipAvailabilities: many(scholarshipAvailability),
}));

/**
 * Quan hệ của ngành học với các bảng khác
 * - Mỗi ngành có nhiều cơ hội nghề nghiệp
 * - Mỗi ngành được đào tạo ở nhiều campus theo từng năm
 * - Mỗi ngành có nhiều học bổng
 */
export const majorsRelations = relations(majors, ({ many }) => ({
  // Danh sách cơ hội nghề nghiệp của ngành
  careers: many(careers),
  // List of campuses and academic years offering this major
  majorCampusAdmissions: many(majorCampusAdmission),
  // Danh sách học bổng áp dụng cho ngành
  scholarshipAvailabilities: many(scholarshipAvailability),
  // Danh sách phương thức xét tuyển của ngành
  admissionMethodApplications: many(admissionMethodApplications),
}));

/**
 * Quan hệ của cơ hội nghề nghiệp với các bảng khác
 * - Mỗi cơ hội nghề nghiệp thuộc về một ngành học
 */
export const careersRelations = relations(careers, ({ one }) => ({
  // Ngành học liên quan đến cơ hội nghề nghiệp
  major: one(majors, {
    fields: [careers.major_id],
    references: [majors.id],
  }),
}));

/**
 * Quan hệ của học bổng với các bảng khác
 * - Mỗi học bổng có thể thuộc về một ngành cụ thể
 * - Mỗi học bổng có thể áp dụng cho nhiều campus và nhiều năm học thông qua bảng scholarshipAvailability
 */
export const scholarshipsRelations = relations(scholarships, ({ many }) => ({
  // List of campuses, majors and academic years where this scholarship is available
  availabilities: many(scholarshipAvailability),
}));

/**
 * Quan hệ của bảng liên kết giữa ngành, campus và năm học
 * - Kết nối ngành học với campus trong từng năm học
 * - Lưu trữ thông tin chỉ tiêu và học phí
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
 * Quan hệ của năm học với các bảng khác
 * - Mỗi năm học có nhiều ngành được đào tạo tại các campus
 * - Mỗi năm học có nhiều phương thức xét tuyển được áp dụng
 * - Mỗi năm học có nhiều học bổng được cung cấp
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
 * Quan hệ của phương thức xét tuyển với các bảng khác
 * - Mỗi phương thức xét tuyển có thể được áp dụng trong nhiều năm học khác nhau
 */
export const admissionMethodsRelations = relations(admissionMethods, ({ many }) => ({
  // Danh sách các áp dụng của phương thức xét tuyển này
  applications: many(admissionMethodApplications),
}));

/**
 * Quan hệ của bảng áp dụng phương thức xét tuyển
 * - Kết nối phương thức xét tuyển với năm học, campus và ngành học (tùy chọn)
 * - Cho phép theo dõi phương thức xét tuyển nào được áp dụng trong năm học nào, ở campus nào và cho ngành nào
 */
export const admissionMethodApplicationsRelations = relations(admissionMethodApplications, ({ one }) => ({
  // Phương thức xét tuyển được áp dụng
  admissionMethod: one(admissionMethods, {
    fields: [admissionMethodApplications.admission_method_id],
    references: [admissionMethods.id],
  }),
  // Academic year
  academicYear: one(academicYears, {
    fields: [admissionMethodApplications.academic_year_id],
    references: [academicYears.id],
  }),
  // Campus áp dụng (tùy chọn)
  campus: one(campuses, {
    fields: [admissionMethodApplications.campus_id],
    references: [campuses.id],
  }),
  // Ngành học áp dụng (tùy chọn)
  major: one(majors, {
    fields: [admissionMethodApplications.major_id],
    references: [majors.id],
  }),
}));

/**
 * Quan hệ của bảng liên kết học bổng với các bảng khác
 * - Mỗi bản ghi liên kết thuộc về một học bổng
 * - Mỗi bản ghi liên kết thuộc về một campus
 * - Mỗi bản ghi liên kết thuộc về một năm học
 */
export const scholarshipAvailabilityRelations = relations(scholarshipAvailability, ({ one }) => ({
  // Học bổng
  scholarship: one(scholarships, {
    fields: [scholarshipAvailability.scholarship_id],
    references: [scholarships.id],
  }),
  // Campus
  campus: one(campuses, {
    fields: [scholarshipAvailability.campus_id],
    references: [campuses.id],
  }),
  // Năm học
  academicYear: one(academicYears, {
    fields: [scholarshipAvailability.academic_year_id],
    references: [academicYears.id],
  }),
  // Ngành học (tùy chọn)
  major: one(majors, {
    fields: [scholarshipAvailability.major_id],
    references: [majors.id],
  }),
}));


