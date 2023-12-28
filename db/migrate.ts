import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config({
  path: '.vercel/.env.development.local',
})

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('Missing POSTGRES_URL');
}

const migrationClient = postgres(connectionString, { max: 1, ssl: true });

// This will run migrations on the database, skipping the ones already applied
await migrate(drizzle(migrationClient), { migrationsFolder: './drizzle' });

console.log('Migrations complete');