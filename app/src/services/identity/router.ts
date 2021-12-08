/*
cypherpost.io
Developed @ Stackmate India
*/
// ------------------ '(◣ ◢)' ---------------------
import { Router } from "express";
import * as val from "express-validator";
import { handleDelete, handleGetAll, handleRegistration, identityMiddleware } from "./dto";

// ------------------ '(◣ ◢)' ---------------------
export const router = Router();
// ------------------ '(◣ ◢)' ---------------------
const registrationCheck = [
  val.check('username').exists().matches(/^(?=.{1,15}$)(?![_.])(?!.*[_.]{2})[a-z][a-z0-9_.]+$/), 
  val.check('pubkey').exists(),
];

const removeCheck = [
  val.check('username').exists().matches(/^(?=.{1,15}$)(?![_.])(?!.*[_.]{2})[a-z][a-z0-9_.]+$/), 
];
// ------------------ '(◣ ◢)' ---------------------
router.use(identityMiddleware);
router.post("/register",registrationCheck, handleRegistration);
router.delete("/", removeCheck, handleDelete);
router.get("/all",handleGetAll);
// ------------------° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °------------------
