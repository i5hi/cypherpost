/*
cypherpost.io
Developed @ Stackmate India
*/
// ------------------ '(◣ ◢)' ---------------------
import { Router } from "express";
import * as val from "express-validator";
import { handleGetAll } from "../identity/dto";
import { badgesMiddleware, handleGetMyBadges, handleRevokeTrust, handleTrust } from "./dto";

// ------------------ '(◣ ◢)' ---------------------
export const router = Router();
// ------------------ '(◣ ◢)' ---------------------
const createTrustedBadgeCheck = [
  val.check('trusting').exists(),
  val.check('nonce').exists(), 
  val.check('signature').exists(),
];

const revokeTrustBadgeCheck = [
  val.check('revoke').exists()
];

// ------------------ '(◣ ◢)' ---------------------
router.use(badgesMiddleware);
router.post("/trust",createTrustedBadgeCheck, handleTrust);
router.get("/all",handleGetAll);
router.get("/self",handleGetMyBadges);
router.post("/trust/revoke",revokeTrustBadgeCheck, handleRevokeTrust);
// ------------------° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °------------------

