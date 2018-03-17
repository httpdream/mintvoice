import { Router, Request, Response } from "express";

const indexRouter = Router();
indexRouter.get("/", (req, res, next) => {
  res.send("hello world");
});

export { indexRouter }