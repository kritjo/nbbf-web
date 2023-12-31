'use server'

import {getAuthenticatedUser} from "./getAuthenticatedUser";
import {db} from "../db/connection";
import {gamePlayers, gameRoundPlayers, gameRounds, users} from "../db/schema";
import {and, eq, not} from "drizzle-orm";
import {PlayersInGameResponse} from "./common";

export const getPlayersInGame = async (token: string, gameID: number): Promise<PlayersInGameResponse> => {
  const authenticatedUser = await getAuthenticatedUser(token, 'medlem');
  if (authenticatedUser === null) {
    return null;
  }

  const gamePlayersInGame =
    db.select().from(gamePlayers).where(eq(gamePlayers.game, gameID)).as('gamePlayersInGame');

  const query = await db.select({
    id: gamePlayersInGame.id, // NOTE: This is the gamePlayers.id column, not the users.id column
    full_name: users.full_name,
    email: users.email,
    role: users.role,
    created_at: users.created_at,
    userId: users.id,
  }).from(users)
    .innerJoin(gamePlayersInGame, eq(users.id, gamePlayersInGame.user))

  const queryTypesafe: {id: number, name: string, type: string, userId: number | null}[] = query.map((q) => {
    if (q.id === null) {
      throw new Error('User not found'); // This should never happen, but just to not get a type error
    }
    return {
      id: q.id,
      name: q.full_name,
      type: q.role,
      userId: q.userId,
    }
  });

  const guestQuery: {id: number, name: string, type: string, userId: number | null}[] = await db.query.gamePlayers.findMany({
    where: and(eq(gamePlayers.game, gameID), not(eq(gamePlayers.guest, ''))),
  }).then((gamePlayers) => {
    return gamePlayers.map((gamePlayer) => {
      return {
        id: gamePlayer.id,
        name: gamePlayer.guest as string,
        type: 'gjest',
        userId: null,
      }
    });
  });

  const allPlayers= queryTypesafe.concat(guestQuery);

  const qs = await db.select().from(gameRoundPlayers)
    .leftJoin(gamePlayers, eq(gamePlayers.id, gameRoundPlayers.game_player))
    .leftJoin(users, eq(gamePlayers.user, users.id))
    .leftJoin(gameRounds, eq(gameRounds.id, gameRoundPlayers.game_round))

  const uniquePlayers = await db.select()
    .from(gamePlayers)
    .leftJoin(users, eq(users.id, gamePlayers.user))
    .where(eq(gamePlayers.game, gameID));

  return {
    players: allPlayers,
    rounds: qs,
    uniquePlayers: uniquePlayers, //TODO: maybe remove this, or add type
  };

}