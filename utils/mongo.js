import { query } from "express";

const MongoClient = require("mongodb");
const GridFSBucket = require("mongodb");

//connection params
const DBNAME = "NovelCovid";
const COLLECTION = "Countries";
const CONNECTION_URI = "mongodb://localhost:27017";

/**
 * connects to MongoDB and returns database object
 */
export const connectMongo = async() => {
    try {
         //establish a connection to database
         const conn = await MongoClient.connect(CONNECTION_URI , {
             useNewUrlParser: true,
             useUnifiedTopology: true
         });

         return conn.db(DBNAME);
    }catch(e){
        console.log(e);
        throw new Error(e);
    }
}

/**
 * Query MongoDB with Find
 */
export const find = async(db, query) => {
    try {
        return await db.collection(COLLECTION).find(query).toArray();
    }catch(e){
        console.log(e);
        throw new Error(e);
    }
}