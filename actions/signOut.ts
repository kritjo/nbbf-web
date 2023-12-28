'use server'

import {db} from "../db/connection";
import {cookies} from "next/headers";
import {userSessions} from "../db/schema";
import {eq} from "drizzle-orm";

export const signOut = async () => {
  await db.update(userSessions).set({
    expires_at: new Date(),
  }).where(eq(userSessions.token, cookies().get('token')?.value ?? ''));
  // eslint-disable-next-line drizzle/enforce-delete-with-where
  cookies().delete('token');
}