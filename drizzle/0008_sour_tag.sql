ALTER TABLE "game_players" ADD CONSTRAINT "game_players_game_id_user_id_guest_unique" UNIQUE("game_id","user_id","guest");