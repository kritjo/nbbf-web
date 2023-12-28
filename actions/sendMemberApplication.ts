'use server'

import {FormResponse} from "./common";
import {z} from "zod";
import {db} from "../db/connection";
import {applications} from "../db/schema";
import {Resend} from "resend";

const schema = z.object({
  full_name: z.string({
    invalid_type_error: 'Invalid Full Name',
  }),
  email: z.string({
    invalid_type_error: 'Invalid Email',
  }),
  title: z.string({
    invalid_type_error: 'Invalid Title',
  }),
  content: z.string({
    invalid_type_error: 'Invalid Content',
  }),
})

export const sendMemberApplication = async (_: any, formData: FormData): Promise<FormResponse> => {
  const validatedFields = schema.safeParse({
    full_name: formData.get('full_name'),
    email: formData.get('email'),
    title: formData.get('title'),
    content: formData.get('content'),
  });

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  console.log(`Member application for ${validatedFields.data.email} received`);

  await db.insert(applications).values({
    full_name: validatedFields.data.full_name,
    email: validatedFields.data.email,
    title: validatedFields.data.title,
    content: validatedFields.data.content,
    status: 'pending',
    status_by: null,
    status_at: null,
    created_at: new Date(),
  });

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: 'soknader@varslinger.bondebridgeforbundet.no',
    to: 'styret@bondebridgeforbundet.no',
    subject: 'Ny medlemsøknad',
    html: `
      <p>Hei</p>
      <p>Det har kommet inn en ny medlemsøknad fra ${validatedFields.data.full_name} (${validatedFields.data.email})</p>
      <p>Ønsker du å godkjenne søknaden, gå til <a href="https://bondebridgeforbundet.no/styresider">https://bondebridgeforbundet.no/styresider</a></p>
      <p>Med vennlig hilsen</p>
      <p>Bondebridgeforbundet</p>
    `,
  });

  return {
    success: true,
    errors: {}
  }
}