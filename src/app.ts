import express, { Application } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import apiRouter from "./api";
import { errorHandler } from "./middlewares/error.middleware";
import swaggerRouter from "./middlewares/swagger.middleware";

const app: Application = express();

app.use(bodyParser.json());
app.use(morgan(
    "dev"
));

// API routes
app.use("/api", apiRouter);

// Swagger documentation
app.use("/docs", swaggerRouter);

// Error handler middleware must be registered last
app.use(errorHandler);

export default app;