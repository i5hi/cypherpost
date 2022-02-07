/*
cypherpost.io
Developed @ Stackmate India
*/
// ------------------ '(◣ ◢)' ---------------------
import { Router } from "express";
import * as val from "express-validator";
import { handleDeleteIdentity, handleGetAllIdentities, handleRegistration, identityMiddleware } from "./dto";

// ------------------ '(◣ ◢)' ---------------------
export const router = Router();
// ------------------ '(◣ ◢)' ---------------------
const registrationCheck = [
  val.check('username').exists().matches(/^(?=.{1,15}$)(?![_.])(?!.*[_.]{2})[a-z][a-z0-9_.]+$/), 
];
const checkGetIdentities = [
  val.check('filter').exists()
];
// ------------------ '(◣ ◢)' ---------------------
router.use(identityMiddleware);
router.post("/",registrationCheck, handleRegistration);
router.get("/all",checkGetIdentities,handleGetAllIdentities);
router.delete("/",handleDeleteIdentity);
// ------------------° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °------------------

