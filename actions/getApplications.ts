'use server'

import {applications, users} from "../db/schema";
import {getAuthenticatedUser} from "./getAuthenticatedUser";
import {db} from "../db/connection";
import {eq} from "drizzle-orm";
import {GetApplicationsResponse} from "./common";

export const getApplications = async (token: string): Promise<GetApplicationsResponse[]> => {
  const authenticatedUser = await getAuthenticatedUser(token, 'styre');
  if (authenticatedUser === null) {
    return [];
  }

  return db.select().from(applications).leftJoin(users, eq(applications.status_by, users.id));
}