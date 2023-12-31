ALTER TABLE "game_players" DROP CONSTRAINT "game_players_game_id_games_id_fk";
--> statement-breakpoint
ALTER TABLE "game_round_players" DROP CONSTRAINT "game_round_players_game_round_id_game_rounds_id_fk";
--> statement-breakpoint
ALTER TABLE "game_rounds" DROP CONSTRAINT "game_rounds_game_id_games_id_fk";
--> statement-breakpoint
ALTER TABLE "game_round_players" DROP CONSTRAINT "game_round_players_game_player_id_game_players_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "game_players" ADD CONSTRAINT "game_players_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "game_round_players" ADD CONSTRAINT "game_round_players_game_round_id_game_rounds_id_fk" FOREIGN KEY ("game_round_id") REFERENCES "game_rounds"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "game_rounds" ADD CONSTRAINT "game_rounds_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "game_round_players" ADD CONSTRAINT "game_round_players_game_player_id_game_players_id_fk" FOREIGN KEY ("game_player_id") REFERENCES "game_players"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
