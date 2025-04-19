DROP TABLE "curriculums" CASCADE;--> statement-breakpoint
ALTER TABLE "sessions" RENAME COLUMN "fb_user_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "platform" varchar(64);--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "hubspot_contact_id" varchar(64);