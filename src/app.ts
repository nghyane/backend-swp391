import express, { Application } from "express";
import bodyParser from "body-parser";
import apiRouter from "./api";
import { errorHandler } from "./middlewares/error.middleware";
import { sessionMiddleware } from "./middlewares/session.middleware";
import morgan from "morgan";

const app: Application = express();

app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(sessionMiddleware);
app.use("/api", apiRouter);
app.use(errorHandler);

export default app;