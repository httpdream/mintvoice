import { Router, Request, Response } from "express";
import { sql } from "../../libs/db";
import noticeRouter from "./notice";
import auditionRouter from "./audition";
import * as crypto from "crypto";

const boardRouter = Router();

boardRouter.use("/notice", noticeRouter);
boardRouter.use("/audition", auditionRouter);

export default boardRouter;
