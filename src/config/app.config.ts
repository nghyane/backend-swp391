/**
 * Configuration object for the application.
 * 
 * Properties:
 * - port: The port number on which the server listens, defaulting to 3000 if not specified in the environment variables.
 * - databaseURL: The connection string for the PostgreSQL database, defaulting to a placeholder URL if not specified in the environment variables.
 */

export const config = {
  port: Number(process.env.PORT) || 3000,
  databaseURL: process.env.DATABASE_URL || "postgres://user:pass@host/db",
};