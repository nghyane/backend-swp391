import express, { Application } from "express";
import bodyParser from "body-parser";
import apiRouter from "./api";
import { errorHandler } from "./middlewares/error.middleware";
import { setupSwagger } from "./docs/swagger-config";
import httpLogger from "./middlewares/logger.middleware";

const app: Application = express();

app.use(bodyParser.json());
app.use(httpLogger);

// API routes
app.use("/api", apiRouter);

// Thiết lập Swagger UI
setupSwagger(app);

// Error handler middleware must be registered last
app.use(errorHandler);

export default app;