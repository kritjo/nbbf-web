'use server'

import {gamePlayers, gameRounds, games, RoundWaitFor} from "../db/schema";
import {getAuthenticatedUser} from "./getAuthenticatedUser";
import {db} from "../db/connection";
import {eq, sql} from "drizzle-orm";

export const changeRoundState = async (token: string, gameId: number, state: RoundWaitFor) => {
  const authenticatedUser = await getAuthenticatedUser(token, 'medlem');
  if (authenticatedUser === null) {
    return false;
  }

  const gamePlayer = await db.query.gamePlayers.findFirst({
    where: eq(gamePlayers.user, authenticatedUser.id),
  });

  if (gamePlayer === undefined && authenticatedUser.role !== 'admin') {
    return false;
  }

  const game = await db.query.games.findFirst({
    where: eq(games.id, gameId),
  });

  if (game === undefined) {
    return false;
  }

  const prevMaxRound = await db.select({
    value: sql`max(${gameRounds.round})`.mapWith(gameRounds.round)
  }).from(gameRounds).where(eq(gameRounds.game, gameId));

  if (prevMaxRound[0].value === null) {
    return false;
  }

  await db.update(gameRounds).set({
    wait_for: state,
  }).where(eq(gameRounds.id, prevMaxRound[0].value));

  return true;
}