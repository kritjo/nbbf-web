import {boolean, integer, pgEnum, pgTable, serial, timestamp, varchar} from "drizzle-orm/pg-core";

const role = ['medlem', 'styre', 'admin'] as const;
export const roleEnum = pgEnum('role_enum', role);
export type Role = typeof role[number];

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 256 }).unique().notNull(),
  full_name: varchar('full_name', { length: 256 }).unique().notNull(),
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

export const applications = pgTable('applications', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 256 }).notNull(),
  full_name: varchar('full_name', { length: 256 }).notNull(),
  title: varchar('title', { length: 256 }).notNull(),
  content: varchar('content', { length: 256 }).notNull(),
  approved: boolean('approved').notNull(),
  approved_status_by: integer('approved_status_by').references(() => users.id),
  approved_status_at: timestamp('approved_status_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).notNull(),
});
