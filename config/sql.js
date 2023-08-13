const mysql = require('mysql2')
const fs = require('fs')
require('dotenv').config()

const db = mysql.createPool({
  host:process.env.SQL_HOST, 
  user:process.env.SQL_USERNAME, 
  password:process.env.SQL_PASSWORD, 
  database:process.env.SQL_DBNAME, 
  port:process.env.SQL_PORT,
  ssl: {
    ca: fs.readFileSync("./DigiCertGlobalRootCA.crt.pem")
  }
}).promise();



module.exports = db