'use server'

import {getAuthenticatedUser} from "./getAuthenticatedUser";
import {games} from "../db/schema";
import {eq} from "drizzle-orm";
import {db} from "../db/connection";

export const changeGameState = async (token: string, gameID: number, state: 'started' | 'finished'): Promise<boolean> => {
  const authenticatedUser = await getAuthenticatedUser(token, 'medlem');
  if (authenticatedUser === null) {
    return false;
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

  await db.update(games).set({
    status: state,
  }).where(eq(games.id, gameID));

  return true;
}