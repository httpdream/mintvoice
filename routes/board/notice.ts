import { Router, Request, Response } from "express";
import { sql } from "../../libs/db";
import * as crypto from "crypto";

const noticeRouter = Router();

noticeRouter.get("/", (req, res, next) => {
  if (req.session.language && req.session.language === "en") {
    return res.render("../workspace/notice_eng.html");
  }
  else {
    return res.render("../workspace/notice.html");
  }
});

noticeRouter.post("/write", (req, res, next) => {
  let password = crypto.createHash("sha256").update(`mint-jangjin-mintvoice`).digest("hex");
  if (req.body.password !== password) {
    return res.send("비밀번호가 맞지 않습니다.");
  }
  if (req.session.language && req.session.language === "en") {
    return res.render("../workspace/write_notice_eng.html");
  }
  else {
    return res.render("../workspace/write_notice.html");
  }
});

noticeRouter.get("/list", (req, res, next) => {
  let offset = req.query.offset || 0;
  let limit = req.query.limit || 10;

  sql.exec(`SELECT *
  FROM notice
  WHERE deleted_at IS NULL
  ORDER BY id DESC
  LIMIT ${offset}, ${limit}
  `)
  .then(rows => {
    return sql.exec("SELECT count(*) as c FROM notice WHERE deleted_at IS NULL")
    .then(count => {
      res.json({
        status: 200,
        items: rows,
        count: count[0].c
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

noticeRouter.get("/:id", (req, res, next) => {
  sql.exec(`SELECT *
  FROM notice
  WHERE id = ?
  `, [req.params.id])
  .then(rows => {
    if (req.session.language && req.session.language === "en") {
      return res.render("../workspace/writingView_eng.ejs", {
        id: req.params.id,
        type: "notice"
      });
    }
    else {
      return res.render("../workspace/writingView.ejs", {
        id: req.params.id,
        type: "notice"
      });
    }
  });
});

noticeRouter.get("/view/:id", (req, res, next) => {
  return sql.exec(`SELECT *
  FROM notice
  WHERE id = ?
    AND deleted_at IS NULL`, [req.params.id])
  .then(rows => {
    res.json({
      status: 200,
      item: rows[0] || {}
    });
    
    if (req.query.update) {
      return sql.exec(`UPDATE notice
      SET view = view + 1
      WHERE id = ?
        AND deleted_at IS NULL`, [req.params.id]);
    }
  })
  .catch(err => {
    res.json({
      status: err.status,
      message: err.message
    });
  });
});

noticeRouter.post("/", (req, res, next) => {
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

  const password = crypto.createHash("sha256").update(`mint-jangjin-mintvoice`).digest("hex");
  return sql.exec(`
  INSERT INTO notice (name, password, title, content, phone)
  VALUES
    (?, ?, ?, ?, ?)
  `, [req.body.name, password, req.body.title, req.body.content, req.body.phone])
  .then(rows => {
    return res.json({
      status: 200,
      message: "success"
    });
  })
  .catch(err => {
    return res.json({
      status: 500,
      message: err.message
    });
  });
});

noticeRouter.delete("/:id", (req, res, next) => {
  let password = crypto.createHash("sha256").update(`mint-jangjin-mintvoice`).digest("hex");
  return sql.exec(`
  SELECT *
  FROM notice
  WHERE id = ?
    AND password = ?
  `, [req.params.id, password])
  .then(rows => {
    if (rows.length === 0) {
      throw new Error("비밀번호가 맞지 않습니다.");
    }
    return sql.exec(`
    UPDATE notice
    SET deleted_at = NOW()
      WHERE id = ?
      AND password = ?
    `, [req.params.id, password]);
  })
  .then(rows => {
    return res.json({
      status: 200,
      message: "success"
    });
  })
  .catch(err => {
    return res.json({
      status: 500,
      message: err.message
    });
  });
});

noticeRouter.put("/:id", (req, res, next) => {
  const exist = req.body.name && req.body.phone && req.body.title && req.body.content;
  let password = req.body.password;
  if (!exist) {
    password = crypto.createHash("sha256").update(`mint-jangjin-${req.body.password}`).digest("hex");
  }
  return sql.exec(`
  SELECT *
  FROM notice
  WHERE id = ?
    AND password = ?
  `, [req.params.id, password])
  .then(rows => {
    if (rows.length === 0) {
      throw new Error("비밀번호가 맞지 않습니다.");
    }
    if (exist) {
      return sql.exec(`
      UPDATE notice
      SET name = ?, phone = ?, title = ?, content = ?
      WHERE id = ?
        AND password = ?
      `, [req.body.name, req.body.phone, req.body.title, req.body.content, req.params.id, password]);
    }
  })
  .then(rows => {
    return res.json({
      status: 200,
      password: password,
      message: "success"
    });
  })
  .catch(err => {
    return res.json({
      status: 500,
      message: err.message
    });
  });
});

noticeRouter.post("/write/check", (req, res, next) => {
  let password = req.body.password;
  if (password === "mintvoice") {
    password = crypto.createHash("sha256").update(`mint-jangjin-${req.body.password}`).digest("hex");
    return res.json({
      status: 200,
      password: password,
      message: "success"
    });
  }
  return res.json({
    status: 500,
    message: "비밀번호가 맞지 않습니다."
  });
});

noticeRouter.post("/edit/:id", (req, res, next) => {
  let password = crypto.createHash("sha256").update(`mint-jangjin-mintvoice`).digest("hex");
  return sql.exec(`
  SELECT *
  FROM notice
  WHERE id = ?
    AND password = ?
  `, [req.params.id, req.body.password])
  .then(rows => {
    if (rows.length === 0) {
      return res.send("비밀번호가 맞지 않습니다.");
    }

    if (req.session.language && req.session.language === "en") {
      return res.render("../workspace/edit_notice_eng.ejs", {
        id: req.params.id,
        type: "notice",
        password: req.body.password,
        board: rows[0]
      });
    }
    else {
      return res.render("../workspace/edit_notice.ejs", {
        id: req.params.id,
        type: "notice",
        password: req.body.password,
        board: rows[0]
      });
    }
  })
  .catch(err => {
    return res.json({
      status: 500,
      message: err.message
    });
  });
});

export default noticeRouter;
