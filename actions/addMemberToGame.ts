'use server'

import {getAuthenticatedUser} from "./getAuthenticatedUser";
import {db} from "../db/connection";
import {eq} from "drizzle-orm";
import {gamePlayers, games} from "../db/schema";

export const addMemberToGame = async (token: string, gameID: number, memberID=-1, guestName=""): Promise<boolean> => {
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

  if (memberID === -1 && guestName === "") {
    return false;
  }

  if (memberID !== -1 && guestName !== "") {
    return false;
  }

  if (memberID === -1) {
    await db.insert(gamePlayers).values({
      game: gameID,
      guest: guestName,
      created_at: new Date(),
    });
  } else {
    await db.insert(gamePlayers).values({
      game: gameID,
      user: memberID,
      created_at: new Date(),
    });
  }

  return true;
}