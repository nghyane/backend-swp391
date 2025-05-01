ALTER TABLE "scholarships" DROP CONSTRAINT "scholarships_major_id_majors_id_fk";
--> statement-breakpoint
ALTER TABLE "scholarships" DROP CONSTRAINT "scholarships_campus_id_campuses_id_fk";
--> statement-breakpoint
DROP INDEX "idx_scholarship_year_campus";--> statement-breakpoint
DROP INDEX "idx_scholarship_major";--> statement-breakpoint
DROP INDEX "idx_scholarship_campus";--> statement-breakpoint
ALTER TABLE "campuses" ADD COLUMN "code" varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE "campuses" ADD COLUMN "contact" jsonb DEFAULT '{"phone":"","email":""}' NOT NULL;--> statement-breakpoint
ALTER TABLE "scholarship_availability" ADD COLUMN "major_id" integer;--> statement-breakpoint
ALTER TABLE "scholarship_availability" ADD CONSTRAINT "scholarship_availability_major_id_majors_id_fk" FOREIGN KEY ("major_id") REFERENCES "public"."majors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_scholarship_year_campus_major" ON "scholarship_availability" USING btree ("scholarship_id","academic_year_id","campus_id","major_id");--> statement-breakpoint
ALTER TABLE "scholarships" DROP COLUMN "major_id";--> statement-breakpoint
ALTER TABLE "scholarships" DROP COLUMN "campus_id";--> statement-breakpoint
ALTER TABLE "campuses" ADD CONSTRAINT "campuses_code_unique" UNIQUE("code");