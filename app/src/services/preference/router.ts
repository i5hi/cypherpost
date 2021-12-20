/*
cypherpost.io
Developed @ Stackmate India
*/
// ------------------ '(◣ ◢)' ---------------------
import { Router } from "express";
import * as val from "express-validator";
import { handleReadPreference, handleSetPreference, preferenceMiddleware } from "./dto";
// ------------------ '(◣ ◢)' ---------------------
export const router = Router();
// ------------------ '(◣ ◢)' ---------------------
const setPreferenceCheck = [
  val.check('cypher_json').exists(),
];
// ------------------ '(◣ ◢)' ---------------------
router.use(preferenceMiddleware);
router.post("/",setPreferenceCheck, handleSetPreference);
router.get("/",handleReadPreference);
// ------------------° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °------------------

