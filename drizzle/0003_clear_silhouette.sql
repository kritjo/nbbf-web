DO $$ BEGIN
 CREATE TYPE "status_enum" AS ENUM('pending', 'approved', 'rejected');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "status" "status_enum" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "applications" DROP COLUMN IF EXISTS "approved";