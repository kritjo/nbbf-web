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
  waiting_for: RoundWaitFor | null,
}

export type PlayersInGameResponse = {
  players: {id: number, name: string, type: string, userId: number | null}[],
  rounds: {
    users: {id: number, email: string, full_name: string, created_at: Date, role: "medlem" | "styre" | "admin"} | null,
    game_players: {id: number, game: number, user: number | null, guest: string | null, created_at: Date} | null,
    game_round_players: {id: number, game_round: number, game_player: number, bid: number, tricks: number, created_at: Date},
    game_rounds: {id: number, game: number, round: number, created_at: Date, wait_for: RoundWaitFor} | null,
  }[]
} | null