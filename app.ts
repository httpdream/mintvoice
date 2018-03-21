import * as express from "express";
import * as bodyParser from "body-parser";
import * as multer from "multer";

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

import { indexRouter } from "./routes/index";

const app: express.Express = express();

let upload = multer({ storage: storage });

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.engine("html", require("ejs").renderFile);
app.use(express.static("workspace"));

app.use("/", indexRouter);

app.post("/upload", upload.single("sampleFile"), (req, res, next) => {
  res.send(req.file);
});
export { app };
