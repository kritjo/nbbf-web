'use server'

import {FormResponse} from "./common";
import {z} from "zod";
import {getAuthenticatedUser} from "./getAuthenticatedUser";
import {db} from "../db/connection";
import {games} from "../db/schema";
import {revalidatePath} from "next/cache";

const schema = z.object({
  name: z.string({
    invalid_type_error: 'Invalid Name',
  }),
  official: z.nullable(z.boolean()),
})

export const createGame = async (token: string, _: any, formData: FormData): Promise<FormResponse> => {
  const validatedFields = schema.safeParse({
    name: formData.get('name'),
    official: formData.get('official'),
  });

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const authenticatedUser = await getAuthenticatedUser(token, 'medlem');
  if (authenticatedUser === null) {
    return {
      success: false,
      errors: {
        token: ['Invalid token']
      },
    }
  }

  if (authenticatedUser.role === 'admin' && validatedFields.data.official !== null) {
    await db.insert(games).values({
      name: validatedFields.data.name,
      official: validatedFields.data.official,
      created_by: authenticatedUser.id,
      created_at: new Date(),
    });
  } else {
    await db.insert(games).values({
      name: validatedFields.data.name,
      created_by: authenticatedUser.id,
      created_at: new Date(),
    });
  }

  revalidatePath('/spill')

  return {
    success: true,
    errors: {},
  }
}