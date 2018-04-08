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
    let category = file.originalname.substring(file.originalname.indexOf("[") + 1, file.originalname.indexOf("]"));
    let remain = file.originalname.substring(file.originalname.indexOf("]") + 2).split(".")[0].split("_");
    let feels_split = remain[remain.length - 1].split(",")
    let gender = "";
    let age = "";
    let octave = "";
    let feels: string[] = [];
    remain.push(category);

    return sql.exec(`
    SELECT id, type, name
    FROM tag
    WHERE name IN (?)
    `, [remain.concat(feels_split)])
    .then (tags => {
      tags.forEach(tag => {
        switch (tag.type) {
          case "category":
            category = tag.id;
            break;
          case "gender":
            gender = tag.id;
            break;
          case "age":
            age = tag.id;
            break;
          case "octave":
            octave = tag.id;
            break;
          case "feels":
            feels.push(String(tag.id));
            break;
        }
      });

      sql.exec(`
      INSERT INTO voice (name, filename, original_filename)
      VALUES
      (?, ?, ?)
      `, [req.body.name, file.originalname, file.originalname])
      .then (row => {
        sql.exec(`
        INSERT INTO tag_voice (voice_id, category, gender, age, octave, feels)
        VALUES
        (?, ?, ?, ?, ?, ?)
        `, [row.insertId, category, gender, age, octave, JSON.stringify(feels)]);
      });
    })
    .then (() => {
      cb(null, file.originalname);
    });
  }
});

let upload = multer({ storage: storage });

voiceRouter.post("/upload", upload.single("voiceFile"), (req, res, next) => {
  res.send(req["file"]);
});

voiceRouter.get("/upload", (req, res, next) => {
  return res.render("../workspace/uploadFile.html");
});

voiceRouter.get("/search", (req, res, next) => {
  let query = "";
  if (typeof req.query.category !== "object") {
    req.query.category = [req.query.category]
  }

  if (typeof req.query.gender !== "object") {
    req.query.gender = [req.query.gender]
  }
  if (typeof req.query.age !== "object") {
    req.query.age = [req.query.age]
  }
  if (typeof req.query.octave !== "object") {
    req.query.octave = [req.query.octave]
  }
  if (typeof req.query.feels !== "object") {
    req.query.feels = [req.query.feels]
  }

  req.query.offset = +req.query.offset || 0;
  req.query.limit = +req.query.limit || 10;

  let feels = req.query.feels.map(feel => `"${feel}"`);
  query = `
  where
  category in (${req.query.category.join()})
  AND
    gender in (${req.query.gender.join()})
  AND
    age in (${req.query.age.join()})
  AND
    octave in (${req.query.octave.join()})
  AND
    feels REGEXP '${feels.join("|")}'
  `;

  if (req.query === {}) {
    query = "";
  }

  sql.exec(`
  select voice.*, tag_voice.*
  from tag_voice
  inner join voice
  on voice.id = tag_voice.voice_id
  ${query}
  LIMIT ${req.query.offset}, ${req.query.limit}
  `)
  .then (rows => {
    res.json({
      status: 200,
      items: rows
    });
  });
});

export default voiceRouter;
