import { pgTable, serial, varchar, integer, text, boolean, timestamp, pgEnum, uniqueIndex, index, jsonb } from "drizzle-orm/pg-core";

/**
 * Enum cho vai trò người dùng nội bộ
 */
export const INTERNAL_USER_ROLES = ["admin", "staff"] as const;
export const internalUserRoleEnum = pgEnum("internal_user_role", INTERNAL_USER_ROLES);
export type InternalUserRole = typeof INTERNAL_USER_ROLES[number];

/**
 * Danh sách các năm tuyển sinh
 */
export const academicYears = pgTable("academic_years", {
  id: serial("id").primaryKey(),
  year: integer("year").notNull(),
});

/**
 * Thông tin các ngành học
 */
export const majors = pgTable("majors", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
});

/**
 * Nghề nghiệp gợi ý theo ngành
 */
export const careers = pgTable("careers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  salary_range: varchar("salary_range", { length: 100 }),
  category: varchar("category", { length: 100 }),
  info_url: varchar("info_url", { length: 255 }),
  major_id: integer("major_id").references(() => majors.id).notNull(),
}, (table) => [
  index("idx_career_major").on(table.major_id),
  index("idx_career_category").on(table.category),
]);

/**
 * Các cơ sở đào tạo (campus)
 */
export const campuses = pgTable("campuses", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 10 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address"),
  contact: jsonb("contact").notNull().default('{"phone":"","email":""}'),
});

/**
 * Tuyển sinh từng ngành tại từng campus và năm
 */
export const majorCampusAdmission = pgTable("major_campus_admission", {
  id: serial("id").primaryKey(),
  major_id: integer("major_id").references(() => majors.id).notNull(),
  campus_id: integer("campus_id").references(() => campuses.id).notNull(),
  academic_year_id: integer("academic_year_id").references(() => academicYears.id).notNull(),
  quota: integer("quota"),
  tuition_fee: integer("tuition_fee"),
}, (table) => [
  uniqueIndex("uniq_major_campus_year").on(table.major_id, table.campus_id, table.academic_year_id),
]);

/**
 * Học bổng theo ngành và cơ sở
 */
export const scholarships = pgTable("scholarships", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  condition: text("condition"),
  amount: integer("amount"),
  major_id: integer("major_id").references(() => majors.id),
  campus_id: integer("campus_id").references(() => campuses.id),
  application_url: varchar("application_url", { length: 255 }),
}, (table) => [
  index("idx_scholarship_major").on(table.major_id),
  index("idx_scholarship_campus").on(table.campus_id),
]);

/**
 * Bảng tài khoản người dùng nội bộ (admin, staff)
 */
export const internalUsers = pgTable("internal_users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 64 }).notNull().unique(),
  password_hash: varchar("password_hash", { length: 255 }).notNull(),
  role: internalUserRoleEnum("role").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
});

/**
 * Lưu thông tin session người dùng
 */
export const sessions = pgTable("sessions", {
  session_id: varchar("session_id", { length: 64 }).primaryKey(),
  platform: varchar("platform", { length: 64 }),
  user_id: varchar("user_id", { length: 64 }),
  hubspot_contact_id: varchar("hubspot_contact_id", { length: 64 }),
  anonymous: boolean("anonymous").default(true),
}, (table) => [
  index("idx_user_id").on(table.user_id),
  index("idx_hubspot_contact_id").on(table.hubspot_contact_id),
]);

/**
 * Các hình thức xét tuyển (học bạ, thi THPT, phỏng vấn...)
 */
export const admissionMethods = pgTable("admission_methods", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  application_url: varchar("application_url", { length: 255 }),
});

/**
 * Ký túc xá tại từng cơ sở
 */
export const dormitories = pgTable("dormitories", {
  id: serial("id").primaryKey(),
  campus_id: integer("campus_id").references(() => campuses.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  capacity: integer("capacity"),
}, (table) => [
  index("idx_dormitory_campus").on(table.campus_id),
]);

/**
 * Bảng áp dụng phương thức xét tuyển cho năm học, campus và ngành học
 * Khi major_id là null, phương thức xét tuyển áp dụng cho tất cả các ngành
 * Khi major_id có giá trị, phương thức xét tuyển chỉ áp dụng cho ngành cụ thể
 */
export const admissionMethodApplications = pgTable("admission_method_applications", {
  id: serial("id").primaryKey(),
  admission_method_id: integer("admission_method_id").references(() => admissionMethods.id).notNull(),
  academic_year_id: integer("academic_year_id").references(() => academicYears.id).notNull(),
  campus_id: integer("campus_id").references(() => campuses.id),
  major_id: integer("major_id").references(() => majors.id),
  min_score: integer("min_score"),
  is_active: boolean("is_active").default(true),
  note: text("note"),
}, (table) => [
  // Ensure no duplicate records for the same admission method, academic year, campus, and major
  uniqueIndex("uniq_admission_year_campus_major").on(
    table.admission_method_id, 
    table.academic_year_id,
    table.campus_id,
    table.major_id
  ),
  // Index to optimize queries
  index("idx_admission_app_method").on(table.admission_method_id),
  index("idx_admission_app_major").on(table.major_id),
]);

/**
 * Bảng liên kết giữa học bổng và năm học
 */
export const scholarshipAvailability = pgTable("scholarship_availability", {
  id: serial("id").primaryKey(),
  scholarship_id: integer("scholarship_id").references(() => scholarships.id).notNull(),
  academic_year_id: integer("academic_year_id").references(() => academicYears.id).notNull(),
  campus_id: integer("campus_id").references(() => campuses.id),
}, (table) => [
  index("idx_scholarship_year_campus").on(table.scholarship_id, table.academic_year_id, table.campus_id),
]);


