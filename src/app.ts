import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import apiRouter from "./api";
import { errorHandler } from "./middlewares/error.middleware";
import { setupSwagger } from "./docs/swagger-config";
import httpLogger from "./middlewares/logger.middleware";

const app: Application = express();

app.use(bodyParser.json());
app.use(httpLogger);

// Enable CORS for all routes
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/", (_req: Request, res: Response) => {
  res.status(200).send('<meta name="zalo-platform-site-verification" content="MO64CPsZ43TwjxS8-fSR2NwqpXIImXX8D38v" />');
});


// API routes
app.use("/api", apiRouter);

// Thiết lập Swagger UI
setupSwagger(app);

// Error handler middleware must be registered last
app.use(errorHandler);

export default app;