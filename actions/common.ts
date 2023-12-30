import {Application, GameStatus, RoundWaitFor, User} from "../db/schema";
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

export type GetGamesResponse = {
  id: number,
  created_by: number,
  creator_name: string | null,
  game_name: string,
  official: boolean,
  status: GameStatus,
  created_at: Date,
  rounds: number,
  players: number,
}

export type GetGameResponseWithWaitingFor = GetGamesResponse & {
  waiting_for: RoundWaitFor
}