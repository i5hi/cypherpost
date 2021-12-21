/*
cypherpost.io
Developed @ Stackmate India
*/
// ------------------ '(◣ ◢)' ---------------------
import express from "express";
import {
    adminMiddleWare, handleGetLandingPage, handleGetLoginPage, handleGetNetworkPage, handleGetPostsPage, handleGetProfilePage, handleGetRegistrationPage, handleGetResetPage
} from "./dto";


// // ------------------ '(◣ ◢' ---------------------
export const router = express.Router();

router.use(adminMiddleWare);
router.get("/", handleGetLandingPage);
router.get("/registration", handleGetRegistrationPage);
router.get("/login", handleGetLoginPage);
router.get("/reset", handleGetResetPage);
router.get("/profile", handleGetProfilePage);
router.get("/network", handleGetNetworkPage);
router.get("/posts", handleGetPostsPage);
// // ------------------ '(◣ ◢)' ---------------------
