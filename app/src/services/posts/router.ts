// /*
// cypherpost.io
// Developed @ Stackmate India
// */
// // ------------------ '(◣ ◢)' ---------------------
// import { Router } from "express";
// import * as val from "express-validator";
// import { handleCreatePost, handleDeletePost, handleGetMyPosts, handleGetOthersPosts, postMiddleware } from "./dto";

// // ------------------ '(◣ ◢)' ---------------------
// export const router = Router();
// // ------------------ '(◣ ◢)' ---------------------
// const createPostCheck = [
//   val.check('expiry').exists(),
//   val.check('derivation_scheme').exists(),
//   val.check('cipher_json').exists(),
//   val.check('decryption_keys').exists().isArray()
// ];

// // ------------------ '(◣ ◢)' ---------------------
// router.use(postMiddleware);
// router.put("/", createPostCheck, handleCreatePost);
// router.get("/self", handleGetMyPosts); 
// router.get("/others", handleGetOthersPosts);
// router.delete("/:id", handleDeletePost);



// // ------------------° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °------------------

