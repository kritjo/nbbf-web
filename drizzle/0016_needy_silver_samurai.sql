ALTER TABLE "game_round_players" ALTER COLUMN "managed" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "game_rounds" DROP COLUMN IF EXISTS "wait_for";