import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import * as relations from "./schema-relations";
import env from "../config/env";
import { log } from "../utils/logger";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
});

// Create db instance with schema and relations to support db.query API
export const db = drizzle(pool, { schema: { ...schema, ...relations } });

export const initDb = async () => {
  try {
    await pool.query("SELECT 1");
    log("✅ Database connected");
  } catch (error) {
    log(`❌ Database connection failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
};

export const closeDb = () =>
  pool.end().then(() => log("✅ Database connection closed"));