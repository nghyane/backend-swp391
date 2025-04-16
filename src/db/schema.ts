import { pgTable, serial, varchar, integer, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const academicYears = pgTable("academic_years", {
  id: serial("id").primaryKey(),
  year: integer("year").notNull(),
});

export const majors = pgTable("majors", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
});

export const curriculums = pgTable("curriculums", {
  id: serial("id").primaryKey(),
  major_id: integer("major_id").references(() => majors.id).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  semester: integer("semester").notNull(),
});

export const careers = pgTable("careers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  major_id: integer("major_id").references(() => majors.id).notNull(),
});

export const campuses = pgTable("campuses", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address"),
});

export const majorCampusAdmission = pgTable("major_campus_admission", {
  id: serial("id").primaryKey(),
  major_id: integer("major_id").references(() => majors.id).notNull(),
  campus_id: integer("campus_id").references(() => campuses.id).notNull(),
  academic_year_id: integer("academic_year_id").references(() => academicYears.id).notNull(),
  quota: integer("quota"),
  tuition_fee: integer("tuition_fee"),
});

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

export const sessions = pgTable("sessions", {
  session_id: varchar("session_id", { length: 64 }).primaryKey(),
  user_id: varchar("user_id", { length: 64 }),
  anonymous: boolean("anonymous").default(true),
  topic_tags: text("topic_tags"),
  created_at: timestamp("created_at").defaultNow(),
  last_used: timestamp("last_used").defaultNow(),
});

export const admissionMethods = pgTable("admission_methods", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  application_url: varchar("application_url", { length: 255 }),
});

export const dormitories = pgTable("dormitories", {
  id: serial("id").primaryKey(),
  campus_id: integer("campus_id").references(() => campuses.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  capacity: integer("capacity"),
});