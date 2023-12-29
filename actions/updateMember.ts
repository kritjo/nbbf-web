'use server'

import {FormResponse} from "./common";
import {getAuthenticatedUser} from "./getAuthenticatedUser";
import {z} from "zod";
import {roles, users} from "../db/schema";
import {eq} from "drizzle-orm";
import {db} from "../db/connection";
import {revalidatePath} from "next/cache";

const schema = z.object({
  full_name: z.string({
    invalid_type_error: 'Invalid Full Name',
  }),
  email: z.string({
    invalid_type_error: 'Invalid Email',
  }),
  role: z.nullable(z.enum(roles)),
})

export const updateMember = async (token: string, _: any, formData: FormData): Promise<FormResponse> => {
  const validatedFields = schema.safeParse({
    full_name: formData.get('full_name'),
    email: formData.get('email'),
    role: formData.get('role'),
  });

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const authenticatedUser = await getAuthenticatedUser(token, 'styre');
  if (authenticatedUser === null) {
    return {
      success: false,
      errors: {
        token: ['Invalid token']
      },
    }
  }

  if (authenticatedUser.role === 'admin' && validatedFields.data.role !== null) {
    await db.update(users).set({
      full_name: validatedFields.data.full_name,
      email: validatedFields.data.email,
      role: validatedFields.data.role,
    }).where(eq(users.email, validatedFields.data.email));
  } else {
    await db.update(users).set({
      full_name: validatedFields.data.full_name,
      email: validatedFields.data.email,
    }).where(eq(users.email, validatedFields.data.email));
  }

  revalidatePath('/styresider')
  revalidatePath('/spill')

  return {
    success: true,
    errors: {},
  }
}