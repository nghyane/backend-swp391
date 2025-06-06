/**
 * Environment configuration module.
 * Loads environment variables from .env file at the earliest point in the application.
 * This file should be imported first in the application entry point.
 */


/**
 * Type definition for environment variables
 */
type EnvironmentVariables = {
  NODE_ENV: string;
  PORT: string;
  DATABASE_URL: string;
  FACEBOOK_VERIFY_TOKEN: string;
  ZALO_APP_ACCESS_TOKEN: string;
  ZALO_APP_REFRESH_TOKEN: string;
  ZALO_APP_ID: string;
  ZALO_APP_SECRET: string;
  AI_AGENT_BASE_URL: string;
  AI_AGENT_APP_NAME: string;
  HUBSPOT_ACCESS_TOKEN: string;
  JWT_SECRET: string;
};

/**
 * Required environment variables that must be present
 */
const requiredEnvVars: Array<keyof EnvironmentVariables> = [
  "DATABASE_URL",
  "PORT",
  "HUBSPOT_ACCESS_TOKEN",
  "JWT_SECRET"
];

// Check for missing required environment variables
const missingEnvVars = requiredEnvVars.filter(
  (envVar) => !process.env[envVar]
);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
}

/**
 * Environment configuration object with typed properties
 */
const env: EnvironmentVariables = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT!,
  DATABASE_URL: process.env.DATABASE_URL!,
  FACEBOOK_VERIFY_TOKEN: process.env.FACEBOOK_VERIFY_TOKEN!,

  ZALO_APP_ACCESS_TOKEN: process.env.ZALO_APP_ACCESS_TOKEN!,
  ZALO_APP_REFRESH_TOKEN: process.env.ZALO_APP_REFRESH_TOKEN!,
  ZALO_APP_ID: process.env.ZALO_APP_ID!,
  ZALO_APP_SECRET: process.env.ZALO_APP_SECRET!,
  AI_AGENT_BASE_URL: process.env.AI_AGENT_BASE_URL!,
  AI_AGENT_APP_NAME: process.env.AI_AGENT_APP_NAME!,
  HUBSPOT_ACCESS_TOKEN: process.env.HUBSPOT_ACCESS_TOKEN!,

  JWT_SECRET: process.env.JWT_SECRET!
};

export default env;
