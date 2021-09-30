/*
cypherpost.io
Developed @ Stackmate India
*/
// ------------------ '(◣ ◢)' ---------------------
import express from "express";
import {
    adminMiddleWare, handleGetInvitationPage, handleGetLandingPage, handleGetLoginPage, handleGetNetworkPage, handleGetPostsPage, handleGetProfilePage, handleGetResetPage
} from "./dto";


// // ------------------ '(◣ ◢' ---------------------
export const router = express.Router();

router.use(adminMiddleWare);
router.get("/", handleGetLandingPage);
router.get("/invitation", handleGetInvitationPage);
router.get("/login", handleGetLoginPage);
router.get("/reset", handleGetResetPage);
router.get("/profile", handleGetProfilePage);
router.get("/network", handleGetNetworkPage);
router.get("/posts", handleGetPostsPage);
// // ------------------ '(◣ ◢)' ---------------------
