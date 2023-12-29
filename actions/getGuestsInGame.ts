import {getAuthenticatedUser} from "./getAuthenticatedUser";
import {db} from "../db/connection";
import {and, eq, not} from "drizzle-orm";
import {gamePlayers} from "../db/schema";

export const getGuestsInGame = async (token: string, gameID: number): Promise<{ guest_name: string, gamePlayersId: number }[]> => {
  const authenticatedUser = await getAuthenticatedUser(token, 'medlem');
  if (authenticatedUser === null) {
    return [];
  }

  return db.query.gamePlayers.findMany({
    where: and(eq(gamePlayers.game, gameID), not(eq(gamePlayers.guest, ''))),
  }).then((gamePlayers) => {
    return gamePlayers.map((gamePlayer) => {
      return {
        guest_name: gamePlayer.guest as string,
        gamePlayersId: gamePlayer.id,
      }
    });
  });
}