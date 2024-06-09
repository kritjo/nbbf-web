'use server'

import {db} from "../db/connection";
import {and, eq} from "drizzle-orm";
import {magicLinks, userSessions} from "../db/schema";
import {randomBytes} from "crypto";
import {cookies} from "next/headers";

export const signIn = async (slug: string) => {
  const magicLink = await db.query.magicLinks.findFirst({
    where: and(eq(magicLinks.slug, slug), eq(magicLinks.used, false)),
  });
  if (!magicLink) {
    throw new Error('Invalid magic link');
  }

  await db.update(magicLinks).set({
    used: true,
  }).where(eq(magicLinks.id, magicLink.id));

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 12);
  const token = randomBytes(64).toString('hex');

  await db.insert(userSessions).values({
    user: magicLink.user,
    token: token,
    expires_at: expiresAt,
    created_at: new Date(),
  });

  cookies().set('token', token, {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
  });
}