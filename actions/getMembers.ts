'use server'

import {User} from "../db/schema";
import {getAuthenticatedUser} from "./getAuthenticatedUser";
import {db} from "../db/connection";

export const getMembers = async (token: string): Promise<User[]> => {
  const authenticatedUser = await getAuthenticatedUser(token, 'styre');
  if (authenticatedUser === null) return [];

  return db.query.users.findMany();
}