import env from "./config/env"; // Load environment variables
import app from "./app";
import { initDb, closeDb } from "./db";
import { logger } from "./utils/logger";
import { zaloQueue } from "./queue";

// Constants
const PORT = Number(env.PORT) || 3000;
const SHUTDOWN_TIMEOUT = 10000; // 10 seconds

/**
 * Initialize the database connection
 */
async function initializeDatabase() {
  try {
    logger.info("📊 Connecting to database...");
    await initDb();
    logger.info("✅ Database connected successfully");
    return true;
  } catch (error) {
    logger.error("❌ Failed to connect to database:", error);
    return false;
  }
}

/**
 * Start the HTTP server
 */
function startHttpServer() {
  return new Promise<{ server: any, success: boolean }>((resolve) => {
    try {
      const server = app.listen(PORT, () => {
        logger.info(`🚀 Server running on http://localhost:${PORT}`);
        resolve({ server, success: true });
      });

      server.on('error', (error: Error) => {
        logger.error(`❌ Failed to start server: ${error.message}`);
        resolve({ server: null, success: false });
      });
    } catch (error) {
      logger.error("❌ Failed to initialize server:", error);
      resolve({ server: null, success: false });
    }
  });
}

/**
 * Gracefully shutdown the server
 */
async function gracefulShutdown(server: any, signal: string) {
  let shutdownTimeout: NodeJS.Timeout;

  return Promise.race([
    new Promise<void>(async (resolve) => {
      logger.warn(`⚡ Received ${signal} signal. Shutting down server...`);

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
        server.close(() => {
          logger.info("🔒 HTTP server closed");
          clearTimeout(shutdownTimeout);
          resolve();
        });
      } catch (error) {
        logger.error("❌ Error during shutdown:", error);
        clearTimeout(shutdownTimeout);
        resolve();
      }
    }),
    new Promise<void>((resolve) => {
      shutdownTimeout = setTimeout(() => {
        logger.warn("⚠️ Shutdown timeout reached, forcing exit");
        resolve();
      }, SHUTDOWN_TIMEOUT);
    })
  ]);
}

/**
 * Main function to start the server
 */
async function startServer() {
  try {
    // Initialize database
    const dbInitialized = await initializeDatabase();
    if (!dbInitialized) {
      logger.error("🛑 Server startup aborted due to database connection failure");
      process.exit(1);
    }

    // Start HTTP server
    const { server, success } = await startHttpServer();
    if (!success) {
      logger.error("🛑 Server startup aborted due to HTTP server initialization failure");
      await closeDb();
      process.exit(1);
    }

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