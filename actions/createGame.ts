import {FormResponse} from "./common";
import {z} from "zod";
import {getAuthenticatedUser} from "./getAuthenticatedUser";
import {db} from "../db/connection";
import {games} from "../db/schema";

const schema = z.object({
  name: z.string({
    invalid_type_error: 'Invalid Name',
  }),
  official: z.nullable(z.boolean()),
})

export const createGame = async (token: string, _: any, formData: FormData): Promise<FormResponse> => {
  console.log(formData.get('name'))
  console.log(formData.get('official'))
  const validatedFields = schema.safeParse({
    name: formData.get('name'),
    official: formData.get('official'),
  });

  console.log("validate")

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    console.log("invalid", validatedFields.error.flatten().fieldErrors)
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  console.log("valid")

  const authenticatedUser = await getAuthenticatedUser(token, 'medlem');
  if (authenticatedUser === null) {
    return {
      success: false,
      errors: {
        token: ['Invalid token']
      },
    }
  }

  console.log("auth")

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

  console.log("success");
  return {
    success: true,
    errors: {},
  }
}