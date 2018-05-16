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
      `, [req.body.name, file.originalname, req.body.name + "_" +file.originalname])
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
  return res.render("../workspace/uploadFile.ejs");
});

voiceRouter.get("/search", (req, res, next) => {
  let query = "where voice.id > 0 ";
  if (Object.keys(req.query).length > 2) {
    if (typeof req.query.category !== "object" && req.query.category !== "") {
      query += `AND category in (${req.query.category})`;
    }

    if (typeof req.query.gender !== "object" && req.query.gender !== "") {
      query += `AND gender in (${req.query.gender})`;
    }
    if (typeof req.query.age !== "object" && req.query.age !== "") {
      query += `AND age in (${req.query.age})`;
    }
    if (typeof req.query.octave !== "object" && req.query.octave !== "") {
      query += `AND octave in (${req.query.octave})`;
    }
    if (typeof req.query.feels !== "object" && req.query.feels !== undefined) {
      req.query.feels = [req.query.feels];
      let feels = req.query.feels.map(feel => `"${feel}"`);
      query += `AND feels REGEXP '${feels.join("|")}'`;
    }
    if (typeof req.query.keyword === "string" && req.query.keyword.length > 0) {
      query += `AND original_filename LIKE "%${req.query.keyword}%"`;
    }
    // korean
    if (typeof req.query.language !== "object" && req.query.language === "1") {
      query += `AND name REGEXP "[가-힣]"`;
    }
    // english
    else if (typeof req.query.language !== "object" && req.query.language === "0") {
      query += `AND name REGEXP "[a-z | A-Z]"`;
    }
  }
  req.query.offset = +req.query.offset || 0;
  req.query.limit = +req.query.limit || 10;

  sql.exec(`
  select voice.*, tag_voice.*
  from tag_voice
  inner join voice
  on voice.id = tag_voice.voice_id
  ${query}
  LIMIT ${req.query.offset}, ${req.query.limit}
  `)
  .then (items => {
    sql.exec(`
    SELECT count(*) as c
    from tag_voice
    inner join voice
    on voice.id = tag_voice.voice_id
    ${query}
    `)
    .then (count => {
      res.json({
        status: 200,
        count: count[0].c,
        items: items
      });
    });
  });
});

export default voiceRouter;
