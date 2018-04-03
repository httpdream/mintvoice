import { Router, Request, Response } from "express";
import { sql } from "../libs/db";
import boardRouter from "./board";
import voiceRouter from "./voice";

const indexRouter = Router();
let countIdData = 0;

indexRouter.get("/", (req, res, next) => {
  sql.exec(`
  SELECT *
  FROM tag`)
  .then (rows => {
    if (rows.length === 0) {
      return res.render("../workspace/main.html");
    }

    let tags = {
      category: [],
      gender: [],
      age: [],
      octave: [],
      feels: []
    };

    rows.forEach(row => {
      tags[row.type].push(row);
    });

    return res.render("../workspace/main.ejs", {
      tags: tags
    });
  });
});

indexRouter.post("/count", (req, res, next) => {
  sql.exec(`
  SELECT COUNT(id) AS c
  FROM voice`)
  .then(voiceCount => {
    countIdData = voiceCount[0]["c"];
    sql.exec(`
    SELECT COUNT(distinct name) AS c
    FROM voice`)
    .then(nameCount => {
      res.json({
        status: 200,
        idcount : countIdData,
        namecount: nameCount[0]["c"]
      });
    })
    .catch(err => {
      res.json({
        status: err.status,
        message: err.message
      });
    });
  })
  .catch(err => {
    res.json({
      status: err.status,
      message: err.message
    });
  });
});

indexRouter.get("/view", (req, res, next) => {
  res.render("../workspace/view.ejs", {
    "abc": "def"
  });
});

indexRouter.use("/board", boardRouter);
indexRouter.use("/voice", voiceRouter);

export { indexRouter };
