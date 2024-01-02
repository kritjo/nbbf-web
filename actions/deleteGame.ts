'use server'

import {getAuthenticatedUser} from "./getAuthenticatedUser";
import {db} from "../db/connection";
import {games} from "../db/schema";
import {eq} from "drizzle-orm";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

export const deleteGame = async (token: string, gameID: number): Promise<boolean> => {
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

  await db.delete(games).where(eq(games.id, gameID));

  revalidatePath('/spill');

  redirect('/spill');
}