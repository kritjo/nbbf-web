ALTER TABLE "magic_links" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_roles" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_roles" ALTER COLUMN "role_id" SET NOT NULL;