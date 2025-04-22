CREATE TYPE "public"."internal_user_role" AS ENUM('admin', 'staff');--> statement-breakpoint
CREATE TABLE "academic_years" (
	"id" serial PRIMARY KEY NOT NULL,
	"year" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admission_method_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"admission_method_id" integer NOT NULL,
	"academic_year_id" integer NOT NULL,
	"campus_id" integer,
	"major_id" integer,
	"min_score" integer,
	"is_active" boolean DEFAULT true,
	"note" text
);
--> statement-breakpoint
CREATE TABLE "admission_methods" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"application_url" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "campuses" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"address" text
);
--> statement-breakpoint
CREATE TABLE "careers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"salary_range" varchar(100),
	"category" varchar(100),
	"info_url" varchar(255),
	"major_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dormitories" (
	"id" serial PRIMARY KEY NOT NULL,
	"campus_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"capacity" integer
);
--> statement-breakpoint
CREATE TABLE "internal_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(64) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"role" "internal_user_role" NOT NULL,
	"email" varchar(255) NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "internal_users_username_unique" UNIQUE("username"),
	CONSTRAINT "internal_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "major_campus_admission" (
	"id" serial PRIMARY KEY NOT NULL,
	"major_id" integer NOT NULL,
	"campus_id" integer NOT NULL,
	"academic_year_id" integer NOT NULL,
	"quota" integer,
	"tuition_fee" integer
);
--> statement-breakpoint
CREATE TABLE "majors" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(20) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	CONSTRAINT "majors_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "scholarship_availability" (
	"id" serial PRIMARY KEY NOT NULL,
	"scholarship_id" integer NOT NULL,
	"academic_year_id" integer NOT NULL,
	"campus_id" integer
);
--> statement-breakpoint
CREATE TABLE "scholarships" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"condition" text,
	"amount" integer,
	"major_id" integer,
	"campus_id" integer,
	"application_url" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"session_id" varchar(64) PRIMARY KEY NOT NULL,
	"platform" varchar(64),
	"user_id" varchar(64),
	"hubspot_contact_id" varchar(64),
	"anonymous" boolean DEFAULT true
);
--> statement-breakpoint
ALTER TABLE "admission_method_applications" ADD CONSTRAINT "admission_method_applications_admission_method_id_admission_methods_id_fk" FOREIGN KEY ("admission_method_id") REFERENCES "public"."admission_methods"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admission_method_applications" ADD CONSTRAINT "admission_method_applications_academic_year_id_academic_years_id_fk" FOREIGN KEY ("academic_year_id") REFERENCES "public"."academic_years"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admission_method_applications" ADD CONSTRAINT "admission_method_applications_campus_id_campuses_id_fk" FOREIGN KEY ("campus_id") REFERENCES "public"."campuses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admission_method_applications" ADD CONSTRAINT "admission_method_applications_major_id_majors_id_fk" FOREIGN KEY ("major_id") REFERENCES "public"."majors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "careers" ADD CONSTRAINT "careers_major_id_majors_id_fk" FOREIGN KEY ("major_id") REFERENCES "public"."majors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dormitories" ADD CONSTRAINT "dormitories_campus_id_campuses_id_fk" FOREIGN KEY ("campus_id") REFERENCES "public"."campuses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "major_campus_admission" ADD CONSTRAINT "major_campus_admission_major_id_majors_id_fk" FOREIGN KEY ("major_id") REFERENCES "public"."majors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "major_campus_admission" ADD CONSTRAINT "major_campus_admission_campus_id_campuses_id_fk" FOREIGN KEY ("campus_id") REFERENCES "public"."campuses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "major_campus_admission" ADD CONSTRAINT "major_campus_admission_academic_year_id_academic_years_id_fk" FOREIGN KEY ("academic_year_id") REFERENCES "public"."academic_years"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scholarship_availability" ADD CONSTRAINT "scholarship_availability_scholarship_id_scholarships_id_fk" FOREIGN KEY ("scholarship_id") REFERENCES "public"."scholarships"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scholarship_availability" ADD CONSTRAINT "scholarship_availability_academic_year_id_academic_years_id_fk" FOREIGN KEY ("academic_year_id") REFERENCES "public"."academic_years"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scholarship_availability" ADD CONSTRAINT "scholarship_availability_campus_id_campuses_id_fk" FOREIGN KEY ("campus_id") REFERENCES "public"."campuses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scholarships" ADD CONSTRAINT "scholarships_major_id_majors_id_fk" FOREIGN KEY ("major_id") REFERENCES "public"."majors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scholarships" ADD CONSTRAINT "scholarships_campus_id_campuses_id_fk" FOREIGN KEY ("campus_id") REFERENCES "public"."campuses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_admission_year_campus_major" ON "admission_method_applications" USING btree ("admission_method_id","academic_year_id","campus_id","major_id");--> statement-breakpoint
CREATE INDEX "idx_admission_app_method" ON "admission_method_applications" USING btree ("admission_method_id");--> statement-breakpoint
CREATE INDEX "idx_admission_app_major" ON "admission_method_applications" USING btree ("major_id");--> statement-breakpoint
CREATE INDEX "idx_career_major" ON "careers" USING btree ("major_id");--> statement-breakpoint
CREATE INDEX "idx_career_category" ON "careers" USING btree ("category");--> statement-breakpoint
CREATE INDEX "idx_dormitory_campus" ON "dormitories" USING btree ("campus_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_major_campus_year" ON "major_campus_admission" USING btree ("major_id","campus_id","academic_year_id");--> statement-breakpoint
CREATE INDEX "idx_scholarship_year_campus" ON "scholarship_availability" USING btree ("scholarship_id","academic_year_id","campus_id");--> statement-breakpoint
CREATE INDEX "idx_scholarship_major" ON "scholarships" USING btree ("major_id");--> statement-breakpoint
CREATE INDEX "idx_scholarship_campus" ON "scholarships" USING btree ("campus_id");--> statement-breakpoint
CREATE INDEX "idx_user_id" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_hubspot_contact_id" ON "sessions" USING btree ("hubspot_contact_id");