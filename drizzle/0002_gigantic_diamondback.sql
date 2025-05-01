ALTER TABLE "admission_method_applications" DROP CONSTRAINT "admission_method_applications_admission_method_id_admission_methods_id_fk";
--> statement-breakpoint
ALTER TABLE "admission_method_applications" DROP CONSTRAINT "admission_method_applications_academic_year_id_academic_years_id_fk";
--> statement-breakpoint
ALTER TABLE "admission_method_applications" DROP CONSTRAINT "admission_method_applications_campus_id_campuses_id_fk";
--> statement-breakpoint
ALTER TABLE "admission_method_applications" DROP CONSTRAINT "admission_method_applications_major_id_majors_id_fk";
--> statement-breakpoint
ALTER TABLE "careers" DROP CONSTRAINT "careers_major_id_majors_id_fk";
--> statement-breakpoint
ALTER TABLE "dormitories" DROP CONSTRAINT "dormitories_campus_id_campuses_id_fk";
--> statement-breakpoint
ALTER TABLE "major_campus_admission" DROP CONSTRAINT "major_campus_admission_major_id_majors_id_fk";
--> statement-breakpoint
ALTER TABLE "major_campus_admission" DROP CONSTRAINT "major_campus_admission_campus_id_campuses_id_fk";
--> statement-breakpoint
ALTER TABLE "major_campus_admission" DROP CONSTRAINT "major_campus_admission_academic_year_id_academic_years_id_fk";
--> statement-breakpoint
ALTER TABLE "scholarship_availability" DROP CONSTRAINT "scholarship_availability_scholarship_id_scholarships_id_fk";
--> statement-breakpoint
ALTER TABLE "scholarship_availability" DROP CONSTRAINT "scholarship_availability_academic_year_id_academic_years_id_fk";
--> statement-breakpoint
ALTER TABLE "scholarship_availability" DROP CONSTRAINT "scholarship_availability_campus_id_campuses_id_fk";
--> statement-breakpoint
ALTER TABLE "scholarship_availability" DROP CONSTRAINT "scholarship_availability_major_id_majors_id_fk";
--> statement-breakpoint
ALTER TABLE "admission_method_applications" ADD CONSTRAINT "admission_method_applications_admission_method_id_admission_methods_id_fk" FOREIGN KEY ("admission_method_id") REFERENCES "public"."admission_methods"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admission_method_applications" ADD CONSTRAINT "admission_method_applications_academic_year_id_academic_years_id_fk" FOREIGN KEY ("academic_year_id") REFERENCES "public"."academic_years"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admission_method_applications" ADD CONSTRAINT "admission_method_applications_campus_id_campuses_id_fk" FOREIGN KEY ("campus_id") REFERENCES "public"."campuses"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admission_method_applications" ADD CONSTRAINT "admission_method_applications_major_id_majors_id_fk" FOREIGN KEY ("major_id") REFERENCES "public"."majors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "careers" ADD CONSTRAINT "careers_major_id_majors_id_fk" FOREIGN KEY ("major_id") REFERENCES "public"."majors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dormitories" ADD CONSTRAINT "dormitories_campus_id_campuses_id_fk" FOREIGN KEY ("campus_id") REFERENCES "public"."campuses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "major_campus_admission" ADD CONSTRAINT "major_campus_admission_major_id_majors_id_fk" FOREIGN KEY ("major_id") REFERENCES "public"."majors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "major_campus_admission" ADD CONSTRAINT "major_campus_admission_campus_id_campuses_id_fk" FOREIGN KEY ("campus_id") REFERENCES "public"."campuses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "major_campus_admission" ADD CONSTRAINT "major_campus_admission_academic_year_id_academic_years_id_fk" FOREIGN KEY ("academic_year_id") REFERENCES "public"."academic_years"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scholarship_availability" ADD CONSTRAINT "scholarship_availability_scholarship_id_scholarships_id_fk" FOREIGN KEY ("scholarship_id") REFERENCES "public"."scholarships"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scholarship_availability" ADD CONSTRAINT "scholarship_availability_academic_year_id_academic_years_id_fk" FOREIGN KEY ("academic_year_id") REFERENCES "public"."academic_years"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scholarship_availability" ADD CONSTRAINT "scholarship_availability_campus_id_campuses_id_fk" FOREIGN KEY ("campus_id") REFERENCES "public"."campuses"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scholarship_availability" ADD CONSTRAINT "scholarship_availability_major_id_majors_id_fk" FOREIGN KEY ("major_id") REFERENCES "public"."majors"("id") ON DELETE set null ON UPDATE no action;