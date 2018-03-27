import * as express from "express";
import * as bodyParser from "body-parser";
import * as multer from "multer";
import { sql } from "./libs/db";

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    let keys = [req.body.category, req.body.gender, req.bod.octave];
    keys = keys.concat(req.body.feels);
    let t = file.originalname.split(".");
    let extension = t[t.length - 1];
    let fileName = keys.join("_") + extension;

    sql.exec(`INSERT INTO voice (filename, original_filename) VALUES (?, ?)
    `, [fileName, file.originalname])
    .then (voice => {
      console.log("insert voice", voice);
      sql.exec(`
      SELECT id, type
      FROM tag
      WHERE
      key in ?
      `, [keys]).then (async rows => {
        for (let row of rows) {
          await sql.exec(`INSERT INTO tag_voice (tag_id, tag_type, voice_id) VALUES (?, ?, ?)
          `, [row.id, row.type, voice.id]);
        }
      });
    })
    .then(() => {
      cb(null, fileName);
    });
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
  res.send(req["file"]);
});

app.use((err: Error, req, res, next) => {
  res.json({
    status: 500,
    message: err.message
  });
});

export { app };
