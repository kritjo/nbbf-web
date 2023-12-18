import { migrate } from 'drizzle-orm/vercel-postgres/migrator';
import { db } from './connection';
import {sql} from "@vercel/postgres";

// This will run migrations on the database, skipping the ones already applied
await migrate(db, { migrationsFolder: './drizzle' });

// End the connection
await sql.end();