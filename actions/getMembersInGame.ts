'use server'

import {gamePlayers, User, users} from "../db/schema";
import {getAuthenticatedUser} from "./getAuthenticatedUser";
import {db} from "../db/connection";
import {eq, not} from "drizzle-orm";

export const getMembersInGame = async (token: string, gameID: number): Promise<User[]> => {
  const authenticatedUser = await getAuthenticatedUser(token, 'medlem');
  if (authenticatedUser === null) {
    return [];
  }

  const gamePlayersInGame = db.select().from(gamePlayers).where(eq(gamePlayers.game, gameID)).as('gamePlayersInGame');

  const query = await db.select({
    id: gamePlayersInGame.user, // NOTE: This is the gamePlayers.user column, not the users.id column
    full_name: users.full_name,
    email: users.email,
    role: users.role,
    created_at: users.created_at,
  }).from(users)
     .innerJoin(gamePlayersInGame, eq(users.id, gamePlayersInGame.user))

  return query.map((q) => {
    if (q.id === null) {
      throw new Error('User not found'); // This should never happen, but just to not get a type error
    }
    return {
      id: q.id,
      full_name: q.full_name,
      email: q.email,
      role: q.role,
      created_at: q.created_at,
    }
  });

}