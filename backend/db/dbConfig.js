const mysql2 = require("mysql2");

const dbConnection = mysql2.createPool({
  user: process.env.DB_USER,
  database: process.env.DATABASE,
  host: process.env.DB_HOST,
  password: process.env.PASSWORD,
  connectionLimit: 10,
});

module.exports = dbConnection.promise();
