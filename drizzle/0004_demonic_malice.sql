ALTER TABLE "applications" RENAME COLUMN "approved_status_by" TO "status_by";--> statement-breakpoint
ALTER TABLE "applications" RENAME COLUMN "approved_status_at" TO "status_at";--> statement-breakpoint
ALTER TABLE "applications" DROP CONSTRAINT "applications_approved_status_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "applications" ALTER COLUMN "status_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "applications" ALTER COLUMN "status_at" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "applications" ADD CONSTRAINT "applications_status_by_users_id_fk" FOREIGN KEY ("status_by") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
