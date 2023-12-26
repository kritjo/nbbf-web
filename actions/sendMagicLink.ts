'use server'

import {z} from "zod";
import {db} from "../db/connection";
import {magicLinks, users} from "../db/schema";
import {eq} from "drizzle-orm";
import {Resend} from "resend";
import {FormResponse} from "./common";

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

const schema = z.object({
  email: z.string({
    invalid_type_error: 'Invalid Email',
  }),
})

export const sendMagicLink = async (_: any, formData: FormData): Promise<FormResponse> => {
  const validatedFields = schema.safeParse({
    email: formData.get('email'),
  });

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  console.log(`Magic link for ${validatedFields.data.email} requested`);

  const user = await db.query.users.findFirst({
    where: eq(users.email, validatedFields.data.email),
  });

  // Before continuing, wait random time between 0 and 0.5 seconds to prevent timing attacks
  await sleep(Math.random() * 500);

  if (!user) {
    return {
      success: true,
      errors: {}
    }
  }

  const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);
  const {email} = validatedFields.data;
  await db.insert(magicLinks).values({
    user: user.id,
    slug: randomString,
    used: false,
    created_at: new Date(),
    expires_at: expiresAt,
  });

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: 'magi@varslinger.bondebridgeforbundet.no',
    to: email,
    subject: 'Pålogging til Bondebridgeforbundet',
    html: `
      <p>Hei ${user.full_name}</p>
      <p>Her er din magiske lenke for å logge inn på Bondebridgeforbundet:</p>
      <p><a href="https://bondebridgeforbundet.no/api/login?token=${randomString}">https://bondebridgeforbundet.no/api/login?token=${randomString}</a></p>
      <p>Lenken er gyldig i 1 time.</p>
      <p>Med vennlig hilsen</p>
      <p>Bondebridgeforbundet</p>
    `,
  });

  return {
    success: true,
    errors: {},
  }
}
