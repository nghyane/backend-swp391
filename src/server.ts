import env from "./config/env";
import app from "./app";
import { initDb, closeDb } from "./db";
import logger from "./utils/pino-logger";
import { zaloQueue } from "./queue";

const PORT = Number(env.PORT) || 3000;
const SHUTDOWN_TIMEOUT = 10000;

// 🚀 Init DB
logger.info('Connecting to database...');
await initDb();

// 🚀 Start Server
const server = app.listen(PORT, '::', () => {
  logger.info(`Server running http://localhost:${PORT}/docs`);
});

// 🧼 Graceful shutdown
async function shutdown(signal: string) {
  logger.warn({ signal }, 'Received signal, cleaning up');

  const forceExit = setTimeout(() => {
    logger.warn('Forced exit after timeout');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT);

  try {
    logger.info('Draining queue');
    await zaloQueue.drain();

    logger.info('Closing database connection');
    await closeDb();

    server.close(() => {
      logger.info('Server closed');
    });
  } catch (err) {
    logger.error({ err }, 'Error during shutdown');
  } finally {
    clearTimeout(forceExit);
    process.exit(0);
  }
}

// 🧠 Listen to system signals (Bun supports process.on)
["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, () => shutdown(signal));
});
