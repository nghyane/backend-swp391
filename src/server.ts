import env from "./config/env"; // Load environment variables
import app from "./app";
import { initDb, closeDb } from "./db";
import { logger } from "./utils/logger";
import { zaloQueue } from "./queue";

// Constants
const PORT = Number(env.PORT) || 3000;
const SHUTDOWN_TIMEOUT = 10000; // 10 seconds

/**
 * Initialize the database connection with proper logging
 */
async function initializeDatabase() {
  logger.info("📊 Connecting to database...");
  await initDb();
  // Success is logged in initDb()
}

/**
 * Start the HTTP server
 * @returns The HTTP server instance
 */
function startHttpServer() {
  const server = app.listen(PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${PORT}`);
  });

  server.on('error', (error: Error) => {
    logger.error(`❌ Failed to start server: ${error.message}`);
    throw error; // Let the caller handle the error
  });

  return server;
}

/**
 * Gracefully shutdown the server
 */
async function gracefulShutdown(server: any, signal: string) {
  logger.warn(`⚡ Received ${signal} signal. Shutting down server...`);

  // Set a timeout to force exit if shutdown takes too long
  const forceExitTimeout = setTimeout(() => {
    logger.warn("⚠️ Shutdown timeout reached, forcing exit");
    process.exit(1);
  }, SHUTDOWN_TIMEOUT);

  try {
    // Drain the queue (wait for pending tasks to complete)
    logger.info("⏳ Draining message queues...");
    await zaloQueue.drain();
    logger.info("✅ Message queues drained");

    // Close database connection
    logger.info("📊 Closing database connection...");
    await closeDb();
    logger.info("✅ Database connection closed");

    // Close HTTP server
    await new Promise<void>((resolve) => {
      server.close(() => {
        logger.info("🔒 HTTP server closed");
        resolve();
      });
    });

  } catch (error) {
    logger.error("❌ Error during shutdown:", error);
  } finally {
    clearTimeout(forceExitTimeout);
  }
}

/**
 * Main function to start the server
 */
async function startServer() {
  try {
    // Initialize database
    await initializeDatabase();

    // Start HTTP server
    const server = startHttpServer();

    // Setup signal handlers for graceful shutdown
    const signals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
    signals.forEach(signal => {
      process.on(signal, async () => {
        await gracefulShutdown(server, signal);
        process.exit(0);
      });
    });

    // Handle uncaught exceptions and unhandled rejections
    process.on('uncaughtException', (error) => {
      logger.error("❌ Uncaught Exception:", error);
      // Don't exit here, just log the error
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
      // Don't exit here, just log the error
    });
  } catch (error) {
    logger.error("❌ Fatal error during server startup:", error);
    process.exit(1);
  }
}

// Start the server
startServer();