import express, { Application } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import apiRouter from "./api";
import { errorHandler } from "./middlewares/error.middleware";
import { setupSwagger } from "./docs/swagger-config";

const app: Application = express();

app.use(bodyParser.json());
app.use(morgan(
    "dev"
));

// API routes
app.use("/api", apiRouter);

// Thiết lập Swagger UI
setupSwagger(app);

// Error handler middleware must be registered last
app.use(errorHandler);

export default app;