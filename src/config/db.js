//Load variables from dotenv
require('dotenv').config();

//Import mysql
const mysql = require('mysql2');

//Create connection pool
const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_DB,
  waitForConnections: true,
});

// Use promises with the connection pool
const database = pool.promise();

//Export database connection for use in other files
module.exports = database;