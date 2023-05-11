const {MongoClient, ServerApiVersion} = require('mongodb');
require('dotenv').config()
const uri = process.env.MONGO_URI;
let dbconnection
let client 
const connectToDb = (cb)=> {
   client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
   try{
      dbconnection = client.db(process.env.DB);
      return cb()
   }catch(error){
      console.log(error);
      return cb(error)
   }

}

const getDb = ()=> dbconnection


module.exports = {connectToDb, getDb, client}