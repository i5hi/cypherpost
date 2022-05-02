/*
cypherpost.io
Developed @ Stackmate India
*/
// ------------------ '(◣ ◢)' ---------------------
import { Router } from "express";
import { handleGetPaymentAddress, handleGetPaymentStatus, handlePostPaymentNotification, paymentMiddleware } from "./dto";
// ------------------ '(◣ ◢)' ---------------------
export const router = Router();
// ------------------ '(◣ ◢)' ---------------------
router.use(paymentMiddleware);
router.get("/address",handleGetPaymentAddress);
router.get("/status",handleGetPaymentStatus);
router.post("/notification",handlePostPaymentNotification);

// ------------------° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °------------------

