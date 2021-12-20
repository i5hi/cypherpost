/*
cypherpost.io
Developed @ Stackmate India
*/
// ------------------ '(◣ ◢)' ---------------------
import { Router } from "express";
import * as val from "express-validator";
import { handleReadPreferences, handleSetPreferences, preferencesMiddleware } from "./dto";
// ------------------ '(◣ ◢)' ---------------------
export const router = Router();
// ------------------ '(◣ ◢)' ---------------------
const setPreferencesCheck = [
  val.check('cypher_json').exists(),
];
// ------------------ '(◣ ◢)' ---------------------
router.use(preferencesMiddleware);
router.post("/",setPreferencesCheck, handleSetPreferences);
router.get("/",handleReadPreferences);
// ------------------° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °------------------

