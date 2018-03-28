import * as express from "express";
import * as bodyParser from "body-parser";
import { sql } from "./libs/db";

import { indexRouter } from "./routes/index";

const app: express.Express = express();

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.engine("html", require("ejs").renderFile);
app.use(express.static("workspace"));

app.use("/", indexRouter);

app.use((err: Error, req, res, next) => {
  res.json({
    status: 500,
    message: err.message
  });
});

export { app };
