import {Application, User} from "../db/schema";

export type FormResponse = {
  success: boolean,
  errors: {
    [key: string]: string[]
  }
}

export type GetApplicationsResponse = {
  applications: Application
  users: User | null
}

export enum ApplicationAction {
  'approved' = 'approved',
  'rejected' = 'rejected'
}