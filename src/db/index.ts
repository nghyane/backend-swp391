import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import * as relations from "./schema-relations";
import env from "../config/env";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
});

// Tạo instance db với schema và relations để hỗ trợ API db.query
export const db = drizzle(pool, { schema: { ...schema, ...relations } });

export const initDb = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Database connected");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

export const closeDb = () =>
  pool.end().then(() => console.log("✅ Database connection closed"));