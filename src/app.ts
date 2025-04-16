import express, { Application } from "express";
import bodyParser from "body-parser";
import apiRouter from "./api";
import { errorHandler } from "./middlewares/error.middleware";

import morgan from "morgan";

const app: Application = express();

app.use(bodyParser.json());
app.use(morgan(
    "dev"
));

app.use("/api", apiRouter);
app.use(errorHandler);

export default app;