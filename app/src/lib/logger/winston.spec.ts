/*
cypherpost.io
Developed @ Stackmate India
*/
import { expect } from "chai";
import { exec } from 'child_process';
import fs from "fs";
import "mocha";
import util from "util";
import { logger } from "./winston";

const LOG_FILE = `${process.env.HOME}/winston/logs/moltres.log`;

// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
// GLOBAL CONFIGURATIONS

// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
describe("Initalizing Test: logger::WINSTON ", function () {
  const message = "*****'(◣ ◢)'*****";

 describe("logger.verbose()", function () {
  it("SHOULD ONLY log to console NOT to file", async function () {
   logger.verbose({
    this: message
   });
   const exec_prom = util.promisify(exec);
   const out = await exec_prom(`tail -2 ${LOG_FILE}`);
   const exists = fs.existsSync(LOG_FILE);
   expect(out.stdout.includes(message)).to.equal(false);
  });
 });

 describe("logger.error()", function () {
  it("SHOULD log to console AND file", async function () {
   logger.error({
    this: message
   });
   const exec_prom = util.promisify(exec);
   const out = await exec_prom(`tail -2 ${LOG_FILE}`);
   expect(out.stdout.includes(message)).to.equal(true);
  });
 });
});

// ------------------ '(◣ ◢)' ---------------------
