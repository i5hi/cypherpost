/*
cypherpost.io
Developed @ Stackmate India
*/

import { expect } from "chai";
import "mocha";
import { DbConnection } from "./interface";
import * as mongo from "./mongo";


// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
// GLOBAL CONFIGURATIONS
const db = new mongo.MongoDatabase();
const connection: DbConnection = {
 port: process.env.DB_PORT,
 ip : process.env.DB_IP,
 name: 'lionbit',
 auth: 'lb:secret',
}
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
describe("Initalizing Test: Mongo Connection ", function () {

 describe("mongo.connect()", function () {
  it("SHOULD open a connection to mongodb", async function () {
   const database = await db.connect(connection);
   expect(database).to.be.a('object')
  });
 });


});

// ------------------ '(◣ ◢)' ---------------------
