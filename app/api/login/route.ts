import {NextRequest, NextResponse} from "next/server";
import {db} from "../../../db/connection";
import {and, eq} from "drizzle-orm";
import {magicLinks, userSessions} from "../../../db/schema";
import {randomBytes} from "crypto";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const slug = searchParams.get('token');
  if (slug === null) {
    return NextResponse.json({
      error: 'No token provided',
    }, {
      status: 400,
    });
  }

  const magicLink = await db.query.magicLinks.findFirst({
    where: and(eq(magicLinks.slug, slug), eq(magicLinks.used, false)),
  });
  if (!magicLink) {
    return NextResponse.json({
      error: 'Invalid token',
    }, {
      status: 400,
    });
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

  return NextResponse.json({
    success: true,
  }, {
    status: 302,
    headers: {
      'Location': '/spill',
      'Set-Cookie': `token=${token}; Path=/; HttpOnly; SameSite=Strict`,
    }
  });
}