/**
 * Environment configuration module.
 * Loads environment variables from .env file at the earliest point in the application.
 * This file should be imported first in the application entry point.
 */

import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

/**
 * Type definition for environment variables
 */
type EnvironmentVariables = {
  NODE_ENV: string;
  PORT: string;
  DATABASE_URL: string;
  FACEBOOK_VERIFY_TOKEN: string;
};

/**
 * Required environment variables that must be present
 */
const requiredEnvVars: Array<keyof EnvironmentVariables> = [
  "DATABASE_URL",
  "PORT",
  "FACEBOOK_VERIFY_TOKEN"
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
  PORT: process.env.PORT as string,
  DATABASE_URL: process.env.DATABASE_URL as string,
  FACEBOOK_VERIFY_TOKEN: process.env.FACEBOOK_VERIFY_TOKEN as string
};

export default env;
