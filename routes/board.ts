import { Router, Request, Response } from "express";
import { sql } from "../libs/db";
import noticeRouter from "./notice";
import contactRouter from "./contact";
import * as crypto from "crypto";

const boardRouter = Router();

boardRouter.use("/notice", noticeRouter);
boardRouter.use("/contact", contactRouter);

export default boardRouter;
