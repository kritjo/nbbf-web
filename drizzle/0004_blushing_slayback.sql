DO $$ BEGIN
 CREATE TYPE "role_enum" AS ENUM('medlem', 'styre', 'admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DROP TABLE "roles";--> statement-breakpoint
DROP TABLE "user_roles";--> statement-breakpoint
ALTER TABLE "applications" DROP CONSTRAINT "applications_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "email" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "role_enum" NOT NULL;--> statement-breakpoint
ALTER TABLE "applications" DROP COLUMN IF EXISTS "user_id";