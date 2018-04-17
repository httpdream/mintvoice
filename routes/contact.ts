import { Router, Request, Response } from "express";
import { sql } from "../libs/db";
import * as crypto from "crypto";

const contactRouter = Router();
  
contactRouter.get("/", (req, res, next) => {
  if (req.session.language && req.session.language === "en") {
    return res.render("../workspace/contact_eng.html");
  }
  else {
    return res.render("../workspace/contact.html");
  }
});
  
contactRouter.get("/write", (req, res, next) => {
  return res.render("../workspace/write_contact.html");
});
  
contactRouter.get("/list", (req, res, next) => {
  let offset = req.query.offset || 0;
  let limit = req.query.limit || 10;

  sql.exec(`SELECT *
  FROM contact
  LIMIT ${offset}, ${limit}
  `)
  .then(rows => {
    return sql.exec("SELECT count(*) as c FROM contact")
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
  
contactRouter.get("/:id", (req, res, next) => {
  sql.exec(`SELECT *
  FROM contact
  WHERE id = ?`, [req.params.id])
  .then(rows => {
    if (req.session.language && req.session.language === "en") {
      return res.render("../workspace/writingView_eng.ejs", {
        id: req.params.id,
        type: "contact"
      });
    }
    else {
      return res.render("../workspace/writingView.ejs", {
        id: req.params.id,
        type: "contact"
      });
    }
  });
});
  
contactRouter.get("/view/:id", (req, res, next) => {
  sql.exec(`SELECT *
  FROM contact
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
  
contactRouter.post("/", (req, res, next) => {
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
  INSERT INTO contact (name, password, title, content, phone)
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
  
contactRouter.delete("/:id", (req, res, next) => {
  const password = crypto.createHash("sha256").update(`mint-jangjin-${req.body.password}`).digest("hex");
  sql.exec(`
  SELECT *
  FROM contact
  WHERE id = ?
    AND password = ?
  `, [req.params.id, password])
  .then(rows => {
    if (rows.length === 0) {
      throw new Error("Board Not Found or Not Matching Password");
    }
    sql.exec(`
    DELETE contact
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
  
contactRouter.put("/:id", (req, res, next) => {
  const password = crypto.createHash("sha256").update(`mint-jangjin-${req.body.password}`).digest("hex");
  sql.exec(`
  SELECT *
  FROM contact
  WHERE id = ?
    AND password = ?
  `, [req.params.id, password])
  .then(rows => {
    if (rows.length === 0) {
      throw new Error("Board Not Found or Not Matching Password");
    }
    sql.exec(`
    UPDATE contact
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

export default contactRouter;