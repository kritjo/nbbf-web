'use server'

import {gamePlayers, gameRounds, games, RoundWaitFor} from "../db/schema";
import {getAuthenticatedUser} from "./getAuthenticatedUser";
import {db} from "../db/connection";
import {eq} from "drizzle-orm";

export const changeRoundState = async (token: string, roundId: number, state: RoundWaitFor) => {
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

  await db.update(gameRounds).set({
    wait_for: state,
  }).where(eq(gameRounds.id, roundId));

  return true;
}