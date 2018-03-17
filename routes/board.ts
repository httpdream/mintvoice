import { Router, Request, Response } from "express";
import { sql } from "../libs/db";
import * as crypto from "crypto";

const boardRouter = Router();

boardRouter.get("/", (req, res, next) => {
  let offset = req.query.offset || 0;
  let limit = req.query.limit || 10;

  sql.exec(`SELECT *
  FROM board
  LIMIT ?, ?
  `, [offset, limit])
  .then(rows => {
    res.json({
      status: 200,
      items: rows
    });
  })
  .catch(err => {
    res.json({
      status: err.status,
      message: err.message
    });
  });
});

boardRouter.get("/:id", (req, res, next) => {
  sql.exec(`SELECT *
  FROM board
  WHERE id = ?`, [req.params.id])
  .then(rows => {
    res.json({
      status: 200,
      item: rows[0] || {}
    });
  })
  .catch(err => {
    res.json({
      status: err.status,
      message: err.message
    });
  });
});

boardRouter.post("/", (req, res, next) => {
  const password = crypto.createHash("sha256").update(`mint-jangjin-${req.body.password}`).digest("hex");
  sql.exec(`
  INSERT INTO board (name, password, title, content, phone)
  VALUES
    (?, ?, ?, ?, ?)
  `, [req.body.name, password, req.body.title, req.body.content, req.body.phone])
  .then(rows => {
    res.json({
      status: 200,
      message: "success"
    });
  })
  .catch(err => {
    res.json({
      status: 500,
      message: err.message
    });
  });
});

boardRouter.delete("/:id", (req, res, next) => {
  const password = crypto.createHash("sha256").update(`mint-jangjin-${req.body.password}`).digest("hex");
  sql.exec(`
  SELECT *
  FROM board
  WHERE id = ?
    AND password = ?
  `, [req.params.id, password])
  .then(rows => {
    if (rows.length === 0) {
      throw new Error("Board Not Found or Not Matching Password");
    }
    sql.exec(`
    DELETE board
    WHERE id = ?
      AND password = ?
    `, [req.params.id, password]);
  })
  .then(rows => {
    res.json({
      status: 200,
      message: "success"
    });
  })
  .catch(err => {
    res.json({
      status: 500,
      message: err.message
    });
  });
});

boardRouter.put("/:id", (req, res, next) => {
  const password = crypto.createHash("sha256").update(`mint-jangjin-${req.body.password}`).digest("hex");
  sql.exec(`
  SELECT *
  FROM board
  WHERE id = ?
    AND password = ?
  `, [req.params.id, password])
  .then(rows => {
    if (rows.length === 0) {
      throw new Error("Board Not Found or Not Matching Password");
    }
    sql.exec(`
    UPDATE board
    SET name = ?, phone = ? title = ?, content = ?
    WHERE id = ?
      AND password = ?
    `, [req.body.name, req.body.phone, req.body.title, req.body.content, req.params.id, password]);
  })
  .then(rows => {
    res.json({
      status: 200,
      message: "success"
    });
  })
  .catch(err => {
    res.json({
      status: 500,
      message: err.message
    });
  });
});

export default boardRouter;
