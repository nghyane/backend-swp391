import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import * as relations from "./schema-relations";
import env from "../config/env";
import { logger } from "../utils/logger";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
});

// Create db instance with schema and relations to support db.query API
export const db = drizzle(pool, { schema: { ...schema, ...relations } });

/**
 * Initialize database connection
 * @returns Promise that resolves when connection is successful or rejects on failure
 */
export const initDb = async () => {
  // Simple connection test - will throw an error if connection fails
  await pool.query("SELECT 1");
  logger.info("✅ Database connected");
};

/**
 * Close database connection
 */
export const closeDb = async () => {
  await pool.end();
};