'use server'

import {User} from "../db/schema";
import {getAuthenticatedUser} from "./getAuthenticatedUser";
import {db} from "../db/connection";

export const getMembers = async (token: string): Promise<User[]> => {
  const authenticatedUser = getAuthenticatedUser(token, 'styre');
  if (!authenticatedUser) {
    return [];
  }

  return await db.query.users.findMany();
}