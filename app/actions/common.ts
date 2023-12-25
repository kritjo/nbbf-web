export type FormResponse = {
  success: boolean,
  errors: {
    [key: string]: string[]
  }
}