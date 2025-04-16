import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { config } from "../config/app.config";

const pool = new Pool({
  connectionString: config.databaseURL,
  max: 10,
  idleTimeoutMillis: 30000,
});

export const db = drizzle(pool);

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