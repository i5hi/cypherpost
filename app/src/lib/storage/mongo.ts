/*
cypherpost.io
Developed @ Stackmate India
*/

// ______________________________________________________
import mongoose from "mongoose";
import { handleError } from "../errors/e";
// import { S5Vault } from '../kms/vault';
import { logger } from "../logger/winston";
import { Database, DbConnection } from "./interface";
// ______________________________________________________
// const kms = new S5Vault();
// ______________________________________________________
export class MongoDatabase implements Database {
  connect(db_options: DbConnection): Promise<object | Error> {
    return new Promise(async (resolve,reject)=>{
      try {
        // const db_auth = await kms.getMongoDbAuth();
        // if (db_auth instanceof Error) return db_auth;
        const db_location = `${db_options.ip}:${db_options.port}`;
        const connect_string = `mongodb://${db_options.auth}@${db_location}/${db_options.name}`;
        // console.log({connect_string})
        const options:mongoose.ConnectOptions = {
          autoIndex: false, // Don't build indexes
          serverSelectionTimeoutMS: 9000, // Keep trying to send operations for 5 seconds
          socketTimeoutMS: 21000, // Close sockets after 21 seconds of inactivity
          family: 4 // Use IPv4, skip trying IPv6
        };

        const database = mongoose
          .connect(connect_string, options)
          .catch(error => {
            logger.error("Error connecting to MongoDb.", error);
          });
    
        mongoose.connection.once("open", () => {
          console.log("Connected to MongoDb.");
          resolve (database);
        });
    
        // If the connection throws an error
        mongoose.connection.on("error", error => {
          logger.error("!!!Error in mongoose connection!!!", error);
          reject (error);
        });
    
        // When the connection is disconnected
        mongoose.connection.on("disconnected", () => {
          logger.error("Disconnected from MongoDb.");
        });
    
        // If the Node process ends, close the Mongoose connection
        process.on("SIGINT", () => {
          mongoose.connection.close(() => {
            logger.error(
              "Mongoose default connection disconnected through app termination"
            );
            process.exit(0);
          });
        });
    
        // quit properly on docker stop
        process.on("SIGTERM", () => {
          mongoose.connection.close(() => {
            logger.error(
              "Mongoose default connection disconnected through app termination"
            );
            process.exit(0);
          });
        });
      } catch (e) {
        return handleError(e);
      }
  
    });
  }
}
//______________________________________________________
