import mysql from "nodejs-mysql";

const config = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "mint"
};

const sql = mysql.getInstance(config);
export { sql };