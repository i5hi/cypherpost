/*
cypherpost.io
Developed @ Stackmate India
*/
// ------------------ '(◣ ◢)' ---------------------
import { Router } from "express";
import * as val from "express-validator";
import {
  authMiddleware, handleGetInvite, handlePostCheckSeed256, handlePostLogin,
  handlePostRegistration,
  handlePostReset
} from "./dto";

// ------------------ '(◣ ◢)' ---------------------
export const router = Router();
// ------------------ '(◣ ◢)' ---------------------
const registrationCheck = [
  val.check('username').exists().matches(/^(?=.{1,15}$)(?![_.])(?!.*[_.]{2})[a-z][a-z0-9_.]+$/), 
  val.check('pass256').exists(),
  val.check('seed256').exists(),
  val.check('invited_by').exists().matches(/^(?=.{1,15}$)(?![_.])(?!.*[_.]{2})[a-zA-Z][a-zA-Z0-9_.]+$/), 
  val.check('invite_code').exists(),
];

const loginCheck = [
  val.check('username').exists().matches(/^(?=.{1,15}$)(?![_.])(?!.*[_.]{2})[a-z][a-z0-9_.]+$/), 
  val.check('pass256').exists(),
];

const resetCheck = [
  val.check('seed256').exists(), 
  val.check('pass256').exists(),
];

// ------------------ '(◣ ◢)' ---------------------
router.use(authMiddleware);
router.post("/register",registrationCheck, handlePostRegistration);
router.post("/login", loginCheck, handlePostLogin);
router.post("/reset", resetCheck, handlePostReset);
router.get("/invite", handleGetInvite);
router.post("/check/seed256", handlePostCheckSeed256);

// ------------------° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °------------------

