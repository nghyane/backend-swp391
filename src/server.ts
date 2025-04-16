import app from "./app";
import { config } from "./config/app.config";
import { initDb, closeDb } from "./db";

const startServer = async () => {
  await initDb();

  const server = app.listen(config.port, () =>
    console.log(`🚀 Server running on http://localhost:${config.port}`)
  );

  process.on("SIGINT", async () => {
    console.log("⚡ Shutting down server...");
    await closeDb();
    server.close(() => {
      console.log("🔒 Server closed.");
      process.exit(0);
    });
  });
};

startServer();