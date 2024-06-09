import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import * as dotenv from 'dotenv';
import { Client } from "pg";

dotenv.config({
  path: '.vercel/.env.development.local',
})

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error('Missing POSTGRES_URL');
}

const migrationClient = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

await migrationClient.connect();

// This will run migrations on the database, skipping the ones already applied
await migrate(drizzle(migrationClient), { migrationsFolder: './drizzle' });

console.log('Migrations complete');