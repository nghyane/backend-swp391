export const config = {
  port: Number(process.env.PORT) || 3000,
  databaseURL: process.env.DATABASE_URL || "postgres://user:pass@host/db",
};