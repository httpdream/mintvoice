import { Router, Request, Response } from "express";
import { sql } from "../libs/db";
import * as crypto from "crypto";
import * as multer from "multer";

const voiceRouter = Router();

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

let upload = multer({ storage: storage });

voiceRouter.post("/upload", upload.single("voiceFile"), (req, res, next) => {
  res.send(req["file"]);
});

voiceRouter.get("/search", (req, res, next) => {
  sql.exec(`
  select voice.*, tag_voice.*
  from tag_voice
  inner join voice
  on voice.id = tag_voice.voice_id
  )`)
  .then (rows => {
    res.json({
      status: 200,
      items: rows
    });
  });

  // where
  // category in (1, 2, 3)
  // and
  // gender in (2, 3, 4, 5,6)
  // and
  // age in (6, 7, 8, 9)
  // and
  // octave in (7,8,9,10,12)
  // and
  // (feels like "%6%"
  // or
  // feels like "%7%"
});

export default voiceRouter;
