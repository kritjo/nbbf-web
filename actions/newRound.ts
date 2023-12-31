'use server'

import {getAuthenticatedUser} from "./getAuthenticatedUser";
import {db} from "../db/connection";
import {eq, sql} from "drizzle-orm";
import {gamePlayers, gameRoundPlayers, gameRounds, games} from "../db/schema";

export const newRound = async (token: string, gameID: number): Promise<boolean> => {
  const authenticatedUser = await getAuthenticatedUser(token, 'medlem');
  if (authenticatedUser === null) {
    return false
  }

  const game = await db.query.games.findFirst({
    where: eq(games.id, gameID),
  });

  if (game === undefined) {
    return false;
  }

  if (game.created_by !== authenticatedUser.id && authenticatedUser.role !== 'admin') {
    return false;
  }

  const prevMaxRound = await db.select({
    value: sql`max(${gameRounds.round})`.mapWith(gameRounds.round)
  }).from(gameRounds).where(eq(gameRounds.game, gameID));

  const maxRound = prevMaxRound[0].value + 1;


  await db.insert(gameRounds).values({
    game: gameID,
    round: maxRound,
    created_at: new Date(),
    wait_for: 'bids',
  });

  const gamePl = await db.query.gamePlayers.findMany({
    where: eq(gamePlayers.game, gameID),
  });

  await db.insert(gameRoundPlayers).values(
    gamePl.map((gp) => {
      return {
        game_round: maxRound,
        game_player: gp.id,
        bid: 0,
        tricks: 0,
        created_at: new Date(),
      }
    })
  );

  return true;
}