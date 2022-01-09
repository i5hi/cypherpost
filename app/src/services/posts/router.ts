/*
cypherpost.io
Developed @ Stackmate India
*/
// ------------------ '(◣ ◢)' ---------------------
import { Router } from "express";
import * as val from "express-validator";
import { handleCreatePost, handleDeletePost, handleGetMyPosts, handleGetOthersPosts, handleGetPosts, handleUpdatePostKeys, postMiddleware } from "./dto";

// ------------------ '(◣ ◢)' ---------------------
export const router = Router();
// ------------------ '(◣ ◢)' ---------------------
const createPostCheck = [
  val.check('expiry').exists(),
  val.check('derivation_scheme').exists(),
  val.check('cypher_json').exists(),
  val.check('reference').optional(),
];

const getPostsCheck=[
  val.check('filter').exists()
]
const updatePostKeysCheck = [
  val.check('decryption_keys').exists().isArray(),
  val.check('post_id').exists()
];

// ------------------ '(◣ ◢)' ---------------------
router.use(postMiddleware);
router.put("/", createPostCheck, handleCreatePost);
router.get("/self", handleGetMyPosts); 
router.get("/",getPostsCheck,handleGetPosts);
router.get("/others", handleGetOthersPosts);
router.delete("/:id", handleDeletePost);
router.put("/keys",updatePostKeysCheck, handleUpdatePostKeys);
// ------------------° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °------------------

