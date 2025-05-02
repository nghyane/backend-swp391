CREATE TABLE "integration_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider" varchar(50) NOT NULL,
	"token_type" varchar(50) NOT NULL,
	"token_value" text NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_provider_token_type" ON "integration_tokens" USING btree ("provider","token_type");--> statement-breakpoint
CREATE INDEX "idx_integration_provider" ON "integration_tokens" USING btree ("provider");