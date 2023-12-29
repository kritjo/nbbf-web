'use server'

import {gamePlayers, User, users} from "../db/schema";
import {getAuthenticatedUser} from "./getAuthenticatedUser";
import {db} from "../db/connection";
import {eq, not} from "drizzle-orm";

export const getMembersNotInGame = async (token: string, gameID: number): Promise<User[]> => {
  const authenticatedUser = await getAuthenticatedUser(token, 'styre');
  if (authenticatedUser === null) {
    return [];
  }

  const gamePlayersInGame = await db.select().from(gamePlayers).where(eq(gamePlayers.game, gameID)).as('gamePlayersInGame')

  const query = await db.select().from(users)
    .leftJoin(gamePlayersInGame, eq(users.id, gamePlayersInGame.user));

  console.log(query);

  return query.filter((q) => q.gamePlayersInGame === null).map((q) => q.users);
}