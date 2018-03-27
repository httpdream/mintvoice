import mysql from "nodejs-mysql";
import * as config from "config";

const mysql_config = {
  host: config.get("mysql.host"),
  port: config.get("mysql.port"),
  user: config.get("mysql.user"),
  password: config.get("mysql.password"),
  database: config.get("mysql.database")
};

const sql = mysql.getInstance(mysql_config);
export { sql };