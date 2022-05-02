/*
cypherpost.io
Developed @ Stackmate India
*/
// ------------------ '(◣ ◢)' ---------------------
import { Router } from "express";
import * as val from "express-validator";
import { badgesMiddleware, handleGetAllBadges, handleGetMyBadges, handleRevokeTrust, handleTrust } from "./dto";

// ------------------ '(◣ ◢)' ---------------------
export const router = Router();
// ------------------ '(◣ ◢)' ---------------------
const createTrustedBadgeCheck = [
  val.check('trusting').exists(),
  val.check('nonce').exists(), 
  val.check('signature').exists(),
];

const revokeTrustBadgeCheck = [
  val.check('revoking').exists()
];

const checkGetBadges = [
  val.check('genesis_filter').optional()
]
// ------------------ '(◣ ◢)' ---------------------
router.use(badgesMiddleware);
router.post("/trust",createTrustedBadgeCheck, handleTrust);
router.get("/all",checkGetBadges,handleGetAllBadges);
router.get("/self",handleGetMyBadges);
router.post("/trust/revoke",revokeTrustBadgeCheck, handleRevokeTrust);
// ------------------° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °------------------

