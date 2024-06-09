import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as dotenv from 'dotenv';

dotenv.config({
  path: '.vercel/.env.development.local',
})

const doMigrate = async (): Promise<void> => {
  const connectionString = process.env.POSTGRES_URL;
  if (!connectionString) {
    throw new Error("POSTGRES_URL is not set");
  }
  const sql = postgres(connectionString, { max: 1, ssl: { rejectUnauthorized: false } });
  const db = drizzle(sql);

  await migrate(db, { migrationsFolder: "drizzle" });

  await sql.end();
};

// The trailing space is important for correct unicode formatting in some shells
doMigrate()
  .then(() => {
    console.log("Migration: ✅ "); // eslint-disable-line no-console -- CLI
  })
  .catch((error: unknown) => {
    console.error("Migration: ❌ ", error);
  });