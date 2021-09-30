/*
cypherpost.io
Developed @ Stackmate India
*/
// ------------------ '(◣ ◢)' ---------------------
import { Router } from "express";
import * as val from "express-validator";
import { handleGetManyProfiles, handleGetProfile, handleGetUsernames, handleMuteUser, handlePostGenesis, handleRevokeTrustUser, handleTrustUser, handleUpdateProfile, profileMiddleware } from "./dto";


// ------------------ '(◣ ◢)' ---------------------
export const router = Router();
// ------------------ '(◣ ◢)' ---------------------
const genesisCheck = [
  val.check('derivation_scheme').isAscii().isLength({min:3, max:21}),
  val.check('recipient_xpub').exists(),
];
const updateCheck = [
  val.check('nickname').optional({nullable: true, checkFalsy: true}).isAscii().isLength({max:50}), 
  val.check('status').optional({nullable: true, checkFalsy: true}).isAscii().isLength({max:160}),
  val.check('cipher_info').optional({nullable: true, checkFalsy: true}).isAscii().isLength({max:365}),

];
const trustCheck = [
  val.check('trusting').exists(), 
  val.check('decryption_key').exists(),
  val.check('signature').exists(),
];
const muteCheck = [
  val.check('trusted_by').exists(), 
  val.check('toggle_mute').exists(),
];
const revokeCheck = [
  val.check('revoking').exists(), 
  val.check('decryption_keys').exists(),
  val.check('derivation_scheme').exists(),
  val.check('cipher_info').exists(),
];
// ------------------ '(◣ ◢)' ---------------------
router.use(profileMiddleware);
router.post("/genesis", genesisCheck, handlePostGenesis);
router.get("/", handleGetProfile); 
router.get("/usernames", handleGetUsernames); 
router.post("/find_many", handleGetManyProfiles); 
router.post("/",updateCheck, handleUpdateProfile);  
router.post("/trust", trustCheck, handleTrustUser);
router.post("/mute", muteCheck, handleMuteUser);
router.post("/revoke", revokeCheck, handleRevokeTrustUser);
// router.post("/reveal/:aspect");



// ------------------° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °------------------

