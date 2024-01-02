'use server'

import {gamePlayers, gameRounds, games, RoundWaitFor} from "../db/schema";
import {getAuthenticatedUser} from "./getAuthenticatedUser";
import {db} from "../db/connection";
import {and, eq, sql} from "drizzle-orm";

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

  const rounds = await db.update(gameRounds).set({
    wait_for: state,
  }).where(and(
    eq(gameRounds.game, gameId),
    eq(gameRounds.round, prevMaxRound[0].value),
  )).returning();

  if (rounds.length !== 1) {
    return false;
  }

  const round = rounds[0];

  const gamePlayrs = await db.query.gamePlayers.findMany({
    where: eq(gamePlayers.game, game.id),
  });

  const max_rounds = Math.round(52 / gamePlayrs.length) * 2;

  if (round.round === max_rounds && round.wait_for === 'finished') {
    await db.update(games).set({
      status: 'finished',
    }).where(eq(games.id, game.id));
  }

  return true;
}