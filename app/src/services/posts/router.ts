/*
cypherpost.io
Developed @ Stackmate India
*/
// ------------------ '(◣ ◢)' ---------------------
import { Router } from "express";
import * as val from "express-validator";
import { handleCreatePost, handleDeletePost, handleGetMyPosts, handleGetOthersPosts, handleUpdatePostKeys, postMiddleware } from "./dto";

// ------------------ '(◣ ◢)' ---------------------
export const router = Router();
// ------------------ '(◣ ◢)' ---------------------
const createPostCheck = [
  val.check('expiry').exists(),
  val.check('derivation_scheme').exists(),
  val.check('cypher_json').exists(),
];

const updatePostKeysCheck = [
  val.check('decryption_keys').exists().isArray()
];

// ------------------ '(◣ ◢)' ---------------------
router.use(postMiddleware);
router.put("/", createPostCheck, handleCreatePost);
router.get("/self", handleGetMyPosts); 
router.get("/others", handleGetOthersPosts);
router.delete("/:id", handleDeletePost);
router.post("/keys/:id",updatePostKeysCheck, handleUpdatePostKeys);
// ------------------° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °------------------

