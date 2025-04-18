import { pgTable, serial, varchar, integer, text, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";

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
 * Chương trình đào tạo theo ngành và học kỳ
 */
export const curriculums = pgTable("curriculums", {
  id: serial("id").primaryKey(),
  major_id: integer("major_id").references(() => majors.id).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  semester: integer("semester").notNull(),
});

/**
 * Nghề nghiệp gợi ý theo ngành
 */
export const careers = pgTable("careers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  major_id: integer("major_id").references(() => majors.id).notNull(),
});

/**
 * Các cơ sở đào tạo (campus)
 */
export const campuses = pgTable("campuses", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address"),
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
});

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
});



/**
 * Bảng tài khoản người dùng nội bộ (admin, staff)
 */
/**
 * Roles for internal users (admin, staff)
 * @readonly
 */
export const INTERNAL_USER_ROLES = ["admin", "staff"] as const;

/**
 * Enum cho vai trò người dùng nội bộ
 */
export const internalUserRoleEnum = pgEnum("internal_user_role", INTERNAL_USER_ROLES);

/**
 * TypeScript type cho vai trò nội bộ
 */
export type InternalUserRole = typeof INTERNAL_USER_ROLES[number];

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
  fb_user_id: varchar("fb_user_id", { length: 64 }),
  anonymous: boolean("anonymous").default(true),
});

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
});