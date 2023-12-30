import {boolean, integer, pgEnum, pgTable, serial, text, timestamp, unique, varchar} from "drizzle-orm/pg-core";

export const roles = ['medlem', 'styre', 'admin'] as const;
export const roleEnum = pgEnum('role_enum', roles);
export type Role = typeof roles[number];

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 256 }).unique().notNull(),
  full_name: varchar('full_name', { length: 256 }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).notNull(),
  role: roleEnum('role').notNull(),
});

export type User = typeof users.$inferSelect;

export const userSessions = pgTable('user_sessions', {
  id: serial('id').primaryKey(),
  user: integer('user_id').references(() => users.id).notNull(),
  token: varchar('token', { length: 256 }).unique().notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).notNull(),
  expires_at: timestamp('expires_at', { withTimezone: true }).notNull(),
});

export const magicLinks = pgTable('magic_links', {
  id: serial('id').primaryKey(),
  user: integer('user_id').references(() => users.id).notNull(),
  slug: varchar('slug', { length: 64 }).unique().notNull(),
  used: boolean('used').notNull().default(false),
  created_at: timestamp('created_at', { withTimezone: true }).notNull(),
  expires_at: timestamp('expires_at', { withTimezone: true }).notNull(),
});

const status = ['pending', 'approved', 'rejected'] as const;
export const statusEnum = pgEnum('status_enum', status);
export type Status = typeof status[number];


export const applications = pgTable('applications', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 256 }).notNull(),
  full_name: varchar('full_name', { length: 256 }).notNull(),
  title: varchar('title', { length: 256 }).notNull(),
  content: text('content').notNull(),
  status: statusEnum('status').notNull().default('pending'),
  status_by: integer('status_by').references(() => users.id),
  status_at: timestamp('status_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).notNull(),
});

export type Application = typeof applications.$inferSelect;

const gameStatus = ['pending', 'started', 'finished'] as const;
export const gameStatusEnum = pgEnum('game_status_enum', gameStatus);
export type GameStatus = typeof gameStatus[number];

export const games = pgTable('games', {
  id: serial('id').primaryKey(),
  created_by: integer('created_by').references(() => users.id).notNull(),
  name: varchar('name', { length: 256 }).notNull(),
  official: boolean('official').notNull().default(false),
  status: gameStatusEnum('status').notNull().default('pending'),
  created_at: timestamp('created_at', { withTimezone: true }).notNull(),
});

export type Game = typeof games.$inferSelect;

export const gamePlayers = pgTable('game_players', {
  id: serial('id').primaryKey(),
  game: integer('game_id').references(() => games.id).notNull(),
  user: integer('user_id').references(() => users.id),
  guest: varchar('guest', { length: 256 }),
  created_at: timestamp('created_at', { withTimezone: true }).notNull(),
}, (table) => ({
  unq: unique().on(table.game, table.user, table.guest),
}));

export type GamePlayer = typeof gamePlayers.$inferSelect;

export const gameRounds = pgTable('game_rounds', {
  id: serial('id').primaryKey(),
  game: integer('game_id').references(() => games.id).notNull(),
  round: integer('round').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).notNull(),
});

export type GameRound = typeof gameRounds.$inferSelect;

export const gameRoundPlayers = pgTable('game_round_players', {
  id: serial('id').primaryKey(),
  game_round: integer('game_round_id').references(() => gameRounds.id).notNull(),
  game_player: integer('game_player_id').references(() => gamePlayers.id).notNull(),
  bid: integer('bid').notNull(),
  tricks: integer('tricks').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).notNull(),
});

export type GameRoundPlayer = typeof gameRoundPlayers.$inferSelect;