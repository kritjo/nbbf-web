CREATE TABLE IF NOT EXISTS "magic_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"slug" varchar(64) NOT NULL,
	"used" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	CONSTRAINT "magic_links_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "magic_links" ADD CONSTRAINT "magic_links_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
