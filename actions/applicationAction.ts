'use server'

import {getAuthenticatedUser} from "./getAuthenticatedUser";
import {ApplicationAction, FormResponse} from "./common";
import {applications, users} from "../db/schema";
import {db} from "../db/connection";
import {eq} from "drizzle-orm";
import {Resend} from "resend";

export const applcationAction = async (token: string, applicationId: number, action: ApplicationAction): Promise<FormResponse> => {
  const authenticatedUser = await getAuthenticatedUser(token, 'styre');
  if (authenticatedUser === null) {
    return {
      success: false,
      errors: {
        token: ['Invalid token']
      }
    }
  }

  const application = await db.query.applications.findFirst({
    where: eq(applications.id, applicationId),
  });

  if (!application) {
    return {
      success: false,
      errors: {
        application: ['Invalid application id']
      }
    }
  }

  await db.update(applications).set({
    status: action,
    status_by: authenticatedUser.id,
    status_at: new Date(),
  }).where(eq(applications.id, applicationId));

  const resend = new Resend(process.env.RESEND_API_KEY);

  if (action === ApplicationAction.approved) {
    console.log(`Application ${applicationId} approved by ${authenticatedUser.email}`);

    const ret = await db.insert(users).values({
      email: application.email,
      full_name: application.full_name,
      role: 'medlem',
      created_at: new Date(),
    }).onConflictDoNothing().returning();

    await resend.emails.send({
      from: 'soknader@varslinger.bondebridgeforbundet.no',
      to: application.email,
      subject: 'Velkommen til Bondebridgeforbundet',
      html: `
      <p>Hei ${application.full_name}</p>
      <p>Din søknad om medlemskap i Bondebridgeforbundet er godkjent.</p>
      <p>Ditt medlemsnummer er ${ret[0].id}.</p>
      <p>Vi gleder oss til å se deg på neste turnering!</p>
      <p>Med vennlig hilsen</p>
      <p>Bondebridgeforbundet</p>
    `,
    });
  } else if (action === ApplicationAction.rejected) {
    console.log(`Application ${applicationId} rejected by ${authenticatedUser.email}`);
    await resend.emails.send({
      from: 'soknader@varslinger.bondebridgeforbundet.no',
      to: application.email,
      subject: 'Velkommen til Bondebridgeforbundet',
      html: `
      <p>Hei ${application.full_name}</p>
      <p>Din søknad om medlemskap i Bondebridgeforbundet er avslått.</p>
      <p>Vi håper du vil prøve igjen senere.</p>
      <p>Med vennlig hilsen</p>
      <p>Bondebridgeforbundet</p>
    `,
    });
  }

  return {
    success: true,
    errors: {}
  }
}