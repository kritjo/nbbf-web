'use server'

import {Application} from "../db/schema";
import {getAuthenticatedUser} from "./getAuthenticatedUser";
import {db} from "../db/connection";

export const getApplications = async (token: string): Promise<Application[]> => {
  const authenticatedUser = await getAuthenticatedUser(token, 'styre');
  if (authenticatedUser === null) {
    return [];
  }

  return await db.query.applications.findMany();
}