/*
cypherpost.io
Developed @ Stackmate India
*/
// ------------------ '(◣ ◢)' ---------------------
import { Router } from "express";
import * as val from "express-validator";
import { handleGetOthersProfile, handleGetSelfProfile, handleUpdateProfile, handleUpdateProfileKeys, profileMiddleware } from "./dto";

// ------------------ '(◣ ◢)' ---------------------
export const router = Router();
// ------------------ '(◣ ◢)' ---------------------
const updateProfileCheck = [
  val.check('derivation_scheme').exists(), 
  val.check('cypher_json').exists(),
];

const updatePostKeysCheck = [
  val.check('decryption_keys').exists().isArray()
];
// ------------------ '(◣ ◢)' ---------------------
router.use(profileMiddleware);
router.post("/",updateProfileCheck, handleUpdateProfile);
router.get("/self",handleGetSelfProfile);
router.get("/others",handleGetOthersProfile);
router.post("/keys",updatePostKeysCheck, handleUpdateProfileKeys);
// ------------------° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °------------------

