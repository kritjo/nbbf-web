ALTER TABLE "game_round_players" ADD COLUMN "managed" boolean;--> statement-breakpoint
ALTER TABLE "game_round_players" DROP COLUMN IF EXISTS "tricks";