import { Router, Request, Response } from "express";
import { sql } from "../libs/db";
import * as crypto from "crypto";

const boardRouter = Router();

boardRouter.get("/notice", (req, res, next) => {
  return res.render("../workspace/notice.html");
});

boardRouter.get("/contact", (req, res, next) => {
  return res.render("../workspace/contact.html");
});

boardRouter.get("/write", (req, res, next) => {
  if (!req.query.type) {
    return res.json({
      status: 400
    });
  }

  if (req.query.type === "notice") {
    // notice authorization
    // if (req["session"].admin) {
    // return res.render("../workspace/authorization_admin.html");
    return res.render("../workspace/write_notice.html");
  }
  else if (req.query.type === "contact") {
    return res.render("../workspace/write_contact.html");
  }
  else {
    return res.json({
      status: 400
    });
  }
})

boardRouter.get("/list", (req, res, next) => {
  let offset = req.query.offset || 0;
  let limit = req.query.limit || 10;
  let type = req.query.type || "";

  sql.exec(`SELECT *
  FROM board
  WHERE type = ?
  LIMIT ?, ?
  `, [type, offset, limit])
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
  if (!req.body.name || req.body.name.length === 0) {
    throw new Error("이름을 넣어주세요");
  }
  if (!req.body.password || req.body.password.length === 0) {
    throw new Error("비밀번호를 넣어주세요");
  }
  if (!req.body.phone || req.body.phone.length === 0) {
    throw new Error("연락처를 넣어주세요");
  }
  if (!req.body.title || req.body.title.length === 0) {
    throw new Error("제목을 넣어주세요");
  }
  if (!req.body.content || req.body.content.length === 0) {
    throw new Error("내용을 넣어주세요");
  }

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
