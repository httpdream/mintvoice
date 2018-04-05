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
    let gender = "";
    let age = "";
    let octave = "";
    let feels: any[] = [];

    return sql.exec(`
    SELECT id, type, name
    FROM tag
    WHERE name IN (?);
    `, [remain])
    .then (tags => {
      tags.forEach(tag => {
        switch (tag.type) {
          case "gender":
            gender = tag.id;
          case "age":
            age = tag.id;
          case "octave":
            octave = tag.id;
          case "feels":
            feels.push(String(tag.id));
        }
      });

      sql.exec(`
      INSERT INTO voice (name, filename, original_filename)
      VALUES
      (?, ?, ?)
      `, ["name", file.originalname, file.originalname])
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

    // let ids = [req.body.category, req.body.gender, req.body.octave];
    // ids = ids.concat(req.body.feels);
    // let t = file.originalname.split(".");
    // let extension = t[t.length - 1];
    // let fileName = "undefined." + extension;

    // return sql.exec(`
    // SELECT id, type, name
    // FROM tag
    // WHERE id IN (?)
    // `, [ids])
    // .then (tags => {
    //   fileName = tags.map(tag => tag.name).join("_") + "." + extension;
    //   return sql.exec(`INSERT INTO voice (filename, name, original_filename) VALUES (?, ?, ?)
    //   `, [fileName, "최장진", file.originalname]);
    // })
    // .then (voice => {
    //   return sql.exec(`INSERT INTO tag_voice (voice_id, category, gender, age, octave, feels) VALUES (?, ?, ?, ?, ?, ?)
    //   `, [voice.insertId, req.body.category, req.body.gender, req.body.age, req.body.octave, JSON.stringify(req.body.feels, null, "  ")]);
    // })
    // .then(() => {
    //   cb(null, fileName);
    // });
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
  sql.exec(`
  select voice.*, tag_voice.*
  from tag_voice
  inner join voice
  on voice.id = tag_voice.voice_id
  where
    category in (?)
  AND
    gender in (?)
  AND
    age in (?)
  AND
    octave in (?)
  AND
    ?
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
