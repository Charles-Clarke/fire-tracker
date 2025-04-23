const sql = require("mssql");
require("dotenv").config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: process.env.DB_ENCRYPT === "true",
    enableArithAbort: true
  }
};

async function connectToDatabase() {
  try {
    await sql.connect(config);
    console.log("Connected to Azure SQL Database");
  } catch (err) {
    console.error("Database connection failed:", err);
  }
}

module.exports = {
  sql,
  connectToDatabase
};
