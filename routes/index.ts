import { Router, Request, Response } from "express";
import { sql } from "../libs/db";
import boardRouter from "./board";

const indexRouter = Router();

indexRouter.get("/", (req, res, next) => {
  res.send("hello world");
});

indexRouter.use("/board", boardRouter);

export { indexRouter };
