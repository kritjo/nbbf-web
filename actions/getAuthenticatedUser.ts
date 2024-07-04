'use server'

import {db} from "../db/connection";
import {eq} from "drizzle-orm";
import {Role, User, users, userSessions} from "../db/schema";
import {hasMinimumRole} from "../lib/utils";

export const getAuthenticatedUser = async (token: string, minReqRole: Role): Promise<User | null> => {
  const userSession = await db.query.userSessions.findFirst({
    where: eq(userSessions.token, token),
  });

  if (!userSession) return null;

  if (userSession.expires_at < new Date()) return null;

  const user = await db.query.users.findFirst({
    where: eq(users.id, userSession?.user),
  });

  if (!user) return null;

  if (hasMinimumRole(user.role, minReqRole)) return user;
  return null;
}