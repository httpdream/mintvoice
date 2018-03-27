import { Router, Request, Response } from "express";
import { sql } from "../libs/db";
import boardRouter from "./board";

const indexRouter = Router();

indexRouter.get("/", (req, res, next) => {
  console.log("hihi");
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

    console.log(tags);

    return res.render("../workspace/main.ejs", {
      tags: tags
    });
  });
});

indexRouter.get("/upload", (req, res, next) => {
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

    console.log(tags);

    return res.render("../workspace/uploadFile.ejs", {
      tags: tags
    });
  });
});

indexRouter.get("/view", (req, res, next) => {
  res.render("../workspace/view.ejs", {
    "abc": "def"
  });
});

indexRouter.use("/board", boardRouter);

export { indexRouter };
