import env from "./config/env"; // Load environment variables
import app from "./app";
import { initDb, closeDb } from "./db";

const startServer = async () => {
  await initDb();

  const server = app.listen(Number(env.PORT), () =>
    console.log(`🚀 Server running on http://localhost:${env.PORT}`)
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