'use server'

import {getAuthenticatedUser} from "./getAuthenticatedUser";
import {db} from "../db/connection";
import {eq} from "drizzle-orm";
import {games} from "../db/schema";

export const deleteGameUser = async (token: string, gamePlayersId: number): Promise<boolean> => {
  const authenticatedUser = await getAuthenticatedUser(token, 'medlem');
  if (authenticatedUser === null) {
    return false;
  }

  const gamePlayer = await db.query.gamePlayers.findFirst({
    where: eq(games.id, gamePlayersId),
  });

  if (gamePlayer === undefined) {
    return false;
  }

  const game = await db.query.games.findFirst({
    where: eq(games.id, gamePlayer.game),
  });

  if (game === undefined) {
    return false;
  }

  if (game.created_by !== authenticatedUser.id && authenticatedUser.role !== 'admin') {
    return false;
  }

  await db.delete(games).where(eq(games.id, gamePlayersId));

  return true;
}