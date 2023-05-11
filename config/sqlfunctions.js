const mysql = require('mysql');
const fs = require('fs')
require('dotenv').config()

const db = mysql.createConnection({
  host:process.env.SQL_HOST, 
  user:process.env.SQL_USERNAME, 
  password:process.env.SQL_PASSWORD, 
  database:process.env.SQL_DBNAME, 
  port:process.env.SQL_PORT, 
  ssl: {
    ca: fs.readFileSync("./DigiCertGlobalRootCA.crt.pem")
  }
});

const ifExist = async(data, table)=> {
    try{
        return new Promise((resolve, reject)=> {
            const sql = `SELECT email, number FROM ${table} WHERE email = '${data.email}' AND number = '${data.number}'`
            db.query(sql, [data.email, data.number], (error, results)=> {
                if(error){reject (error)}
                if(results.length > 0){
                    resolve(true)
                } else{
                    resolve(false)
                }
               
            })
        })
    }catch(error){
        return error.message
    }
}

const ifShopExists = async(data)=> {
    try{
        return new Promise((resolve, reject)=> {
            const sql = `SELECT * FROM shops WHERE shopOwner = '${data.id}' AND shopName = '${data.name}'`
            db.query(sql, (error, results)=> {
                if(error){reject (error)}
                if(results.length > 0){
                    resolve(true)
                } else{
                    resolve(false)
                }
               
            })
        })
    }catch(error){
        return error.message
    }
}
const insertData = (data,table) => {
    return new Promise((resolve, reject) => {
      // Check if the user exists
          // Create the query to insert the data into the table
          let query = `INSERT INTO ${table} SET ?`;
  
          // Execute the query and insert the data into the database
          db.query(query, data, (error, results) => {
            if (error) {
              reject(error);
            } else {
              const success = {data:results, code:0}
              resolve(success);
              db.end()
            }

          });
  
          // Close the connection to the database
    });
  };

 
  const getUsers = async(table)=> {
    try{
        return new Promise((resolve, reject)=> {
            const sql = `SELECT * FROM ${table}`
            db.query(sql, (error, results)=> {
                if(error){reject (error)}
                if(results.length < 0){
                    return resolve(false)
                }
                resolve(results)
                
            })
        })
    }catch(error){
        return error.message
    }
}


const getData = (data,table)=> {
    try{
        return new Promise((resolve, reject)=> {
            const sql = `SELECT * FROM ${table} WHERE email = '${data.email}'`
            db.query(sql, (error, results)=> {
                if(error){reject (error)}
                if(results.length < 0){
                    return resolve(false)
                }
                resolve(results[0])
            })
        })

    }catch(error){
        return error.message
    }
}

const getUserById = (data)=>{
    try{
        return new Promise((resolve, reject)=> {
            const sql = `SELECT * FROM users WHERE userID = '${data.id}'`
            db.query(sql, (error, results)=> {
                if(error){reject (error)}
                if(!results){
                    return resolve(false)
                }
                resolve(results[0])
            })
        })

    }catch(error){
        return error.message
    }
}
  
  
  
  

module.exports={insertData, ifExist, getUsers, getData, ifShopExists, getUserById}