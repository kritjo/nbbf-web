'use server'

import {GetGameResponseWithWaitingFor} from "./common";
import {getAuthenticatedUser} from "./getAuthenticatedUser";
import {db} from "../db/connection";
import {eq, sql} from "drizzle-orm";
import {gamePlayers, gameRounds, games, users} from "../db/schema";

export const getGame = async (token: string, id: number): Promise<GetGameResponseWithWaitingFor | null> => {
  const authenticatedUser = await getAuthenticatedUser(token, 'medlem');
  if (authenticatedUser === null) {
    return null;
  }

  const game_round_count = db.select({
    rounds: sql<number>`cast(count(${users.id}) as int)`.as('rounds'),
    id: gameRounds.game,
  }).from(gameRounds).where(eq(gameRounds.game, id)).groupBy(gameRounds.game).as('game_round_count')

  const game_player_count = db.select({
    players: sql<number>`cast(count(${users.id}) as int)`.as('players'),
    id: gamePlayers.game
  }).from(gamePlayers).where(eq(gamePlayers.game, id)).groupBy(gamePlayers.game).as('game_player_count');

  const creator_name = db.select({
    creator: users.full_name,
    id: games.id
  }).from(games).where(eq(games.id, id)).innerJoin(users, eq(games.created_by, users.id)).as('creator_name');

  const prevMaxRound = await db.select({
    value: sql`max(${gameRounds.round})`.mapWith(gameRounds.round)
  }).from(gameRounds).where(eq(gameRounds.game, id));

  const round = await db.query.gameRounds.findFirst({
    where: eq(gameRounds.id, prevMaxRound[0].value),
  });

  if (round === undefined) {
    return null;
  }

  const responses = await db.select({
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
    .leftJoin(creator_name, eq(games.id, creator_name.id))
    .where(eq(games.id, id));

  if (responses.length === 0) {
    return null;
  } else if (responses.length === 1) {
    return {
      ...responses[0],
      waiting_for: round.wait_for
    }
  } else {
    throw new Error('Multiple games found');
  }
}