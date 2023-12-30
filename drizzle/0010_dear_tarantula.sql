DO $$ BEGIN
 CREATE TYPE "round_wait_for_enum" AS ENUM('bids', 'tricks', 'next_round');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "game_rounds" ADD COLUMN "wait_for" "round_wait_for_enum" DEFAULT 'bids' NOT NULL;