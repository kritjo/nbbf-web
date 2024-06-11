'use server'

import {getAuthenticatedUser} from "./getAuthenticatedUser";
import {db} from "../db/connection";
import {eq} from "drizzle-orm";
import {gameRoundPlayers, gameRounds, games} from "../db/schema";

export const setBidsTricks = async (token: string, roundGamePlayer: number, bids: number, managed: boolean): Promise<boolean> => {
  const authenticatedUser = await getAuthenticatedUser(token, 'medlem');
  if (authenticatedUser === null) {
    return false;
  }

  const roundGamePlayerQuery = await db.query.gameRoundPlayers.findFirst({
    where: eq(gameRoundPlayers.id, roundGamePlayer),
  });

  if (roundGamePlayerQuery === undefined) {
    return false;
  }

  const gameRound = await db.query.gameRounds.findFirst({
    where: eq(gameRounds.id, roundGamePlayerQuery.game_round),
  });

  if (gameRound === undefined) {
    return false;
  }

  const game = await db.query.games.findFirst({
    where: eq(games.id, gameRound.game),
  });

  if (game === undefined) {
    return false;
  }

  if (game.created_by !== authenticatedUser.id && authenticatedUser.role !== 'admin') {
    return false;
  }

  if (game.status !== 'started') {
    return false;
  }

  await db.update(gameRoundPlayers).set({
    bid: bids,
    managed: managed
  }).where(eq(gameRoundPlayers.id, roundGamePlayer));

  return true;
}