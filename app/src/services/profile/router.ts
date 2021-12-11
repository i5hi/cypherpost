/*
cypherpost.io
Developed @ Stackmate India
*/
// ------------------ '(◣ ◢)' ---------------------
import { Router } from "express";
import * as val from "express-validator";
import { handleDeleteProfile, handleGetProfile, handleUpdateProfile, profileMiddleware } from "./dto";

// ------------------ '(◣ ◢)' ---------------------
export const router = Router();
// ------------------ '(◣ ◢)' ---------------------
const updateCheck = [
  val.check('derivation_scheme').exists(), 
  val.check('cypher_json').exists(),
];

// ------------------ '(◣ ◢)' ---------------------
router.use(profileMiddleware);
router.post("/",updateCheck, handleUpdateProfile);
router.get("/:xpub",handleGetProfile);
router.delete("/", handleDeleteProfile);
// ------------------° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °------------------

