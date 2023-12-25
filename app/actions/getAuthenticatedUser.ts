'use server'

import {db} from "../../db/connection";
import {eq} from "drizzle-orm";
import {User, users, userSessions} from "../../db/schema";

export const getAuthenticatedUser = async (token: string): Promise<string> => {
  const userSession = await db.query.userSessions.findFirst({
    where: eq(userSessions.token, token),
  });

  if (!userSession) {
    return "null";
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, userSession?.user),
  });

  if (!user) {
    return "null";
  }

  return "null";
}