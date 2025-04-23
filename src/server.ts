import env from "./config/env"; // Load environment variables
import app from "./app";
import { initDb, closeDb } from "./db";
import { log } from "./utils/logger";

const startServer = async () => {
  await initDb();

  const server = app.listen(Number(env.PORT), () =>
    log(`🚀 Server running on http://localhost:${env.PORT}`)
  );

  process.on("SIGINT", async () => {
    log("⚡ Shutting down server...");
    await closeDb();
    server.close(() => {
      log("🔒 Server closed.");
      process.exit(0);
    });
  });
};

startServer();