CREATE TYPE "public"."internal_user_role" AS ENUM('admin', 'staff');--> statement-breakpoint
CREATE TABLE "academic_years" (
	"id" serial PRIMARY KEY NOT NULL,
	"year" integer NOT NULL
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
	"major_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "curriculums" (
	"id" serial PRIMARY KEY NOT NULL,
	"major_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text,
	"semester" integer NOT NULL
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
	"fb_user_id" varchar(64),
	"anonymous" boolean DEFAULT true
);
--> statement-breakpoint
ALTER TABLE "careers" ADD CONSTRAINT "careers_major_id_majors_id_fk" FOREIGN KEY ("major_id") REFERENCES "public"."majors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "curriculums" ADD CONSTRAINT "curriculums_major_id_majors_id_fk" FOREIGN KEY ("major_id") REFERENCES "public"."majors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dormitories" ADD CONSTRAINT "dormitories_campus_id_campuses_id_fk" FOREIGN KEY ("campus_id") REFERENCES "public"."campuses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "major_campus_admission" ADD CONSTRAINT "major_campus_admission_major_id_majors_id_fk" FOREIGN KEY ("major_id") REFERENCES "public"."majors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "major_campus_admission" ADD CONSTRAINT "major_campus_admission_campus_id_campuses_id_fk" FOREIGN KEY ("campus_id") REFERENCES "public"."campuses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "major_campus_admission" ADD CONSTRAINT "major_campus_admission_academic_year_id_academic_years_id_fk" FOREIGN KEY ("academic_year_id") REFERENCES "public"."academic_years"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scholarships" ADD CONSTRAINT "scholarships_major_id_majors_id_fk" FOREIGN KEY ("major_id") REFERENCES "public"."majors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scholarships" ADD CONSTRAINT "scholarships_campus_id_campuses_id_fk" FOREIGN KEY ("campus_id") REFERENCES "public"."campuses"("id") ON DELETE no action ON UPDATE no action;