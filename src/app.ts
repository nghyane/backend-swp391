import express, { Application } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import apiRouter from "./api";
import zaloWebhookRoutes from "./api/routes/zalo-webhook.route";
import { errorHandler } from "./middlewares/error.middleware";

const app: Application = express();

app.use(bodyParser.json());
app.use(morgan(
    "dev"
));

app.use("/api", apiRouter);
app.use("/chatbot", zaloWebhookRoutes);

// Error handler middleware must be registered last
app.use(errorHandler);

export default app;