import * as express from "express";
import * as bodyParser from "body-parser";
import { indexRouter } from "./routes/index";

const app: express.Express = express();

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.use("/", indexRouter);

export { app };
