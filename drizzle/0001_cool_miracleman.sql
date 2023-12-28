ALTER TABLE "applications" ALTER COLUMN "approved_status_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "full_name" varchar(256) NOT NULL;