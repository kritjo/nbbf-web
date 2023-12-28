import {gamePlayers, gameRounds, games, GameStatus, users} from "../db/schema";
import {getAuthenticatedUser} from "./getAuthenticatedUser";
import {db} from "../db/connection";
import {eq, sql} from "drizzle-orm";
import {GetGamesResponse} from "./common";

export const getMembers = async (token: string): Promise<GetGamesResponse[]> => {
  const authenticatedUser = await getAuthenticatedUser(token, 'medlem');
  if (authenticatedUser === null) {
    return [];
  }

  const game_round_count = db.$with('game_round_count').as(
    db.select({
      rounds: sql<number>`cast(count(${users.id}) as int)`,
      id: gameRounds.game
    }).from(gameRounds).groupBy(gameRounds.game)
  );

  const game_player_count = db.$with('game_player_count').as(
    db.select({
      players: sql<number>`cast(count(${users.id}) as int)`,
      id: gamePlayers.game
    }).from(gamePlayers).groupBy(gamePlayers.game)
  );

  const creator_name = db.$with('creator_name').as(
    db.select({
      creator: users.full_name,
      id: games.id
    }).from(games).innerJoin(users, eq(games.created_by, users.id))
  );

  return db.select({
    id: games.id,
    created_by: games.created_by,
    creator_name: creator_name.creator,
    game_name: games.name,
    official: games.official,
    status: games.status,
    created_at: games.created_at,
    rounds: game_round_count.rounds,
    players: game_player_count.players,
  }).from(games)
    .leftJoin(game_round_count, eq(games.id, game_round_count.id))
    .leftJoin(game_player_count, eq(games.id, game_player_count.id))
    .leftJoin(creator_name, eq(games.id, creator_name.id));
}