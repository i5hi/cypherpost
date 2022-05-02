/*
cypherpost.io
Developed @ Stackmate India
*/

import { CypherpostBitcoinOps } from "../../lib/bitcoin/bitcoin";
import { r_500 } from "../../lib/logger/winston";
import { filterError, parseRequest, respond } from "../../lib/server/handler";

const { validationResult } = require('express-validator');

const bitcoin = new CypherpostBitcoinOps();

export async function paymentMiddleware(req, res, next) {
  const request = parseRequest(req);
  try {
    const signature = request.headers['x-client-signature'];
    const pubkey = request.headers['x-client-pubkey'];
    // CHECK SIG AND PUBKEY FORMAT - RETURNS 500 IF NOT VALID
    const nonce = request.headers['x-nonce'];
    const method = request.method;
    const resource = request.resource;
    const body = JSON.stringify(request.body);
    const message = `${method} ${resource} ${body} ${nonce}`;

    let verified = await bitcoin.verify(message, signature, pubkey);
    if (verified instanceof Error) throw verified;
    else if (!verified) throw{
      code: 401,
      message: "Invalid Request Signature."
    };
    else {
      next();
    };
  }
  catch (e) {
    const result = filterError(e, r_500, request);
    respond(result.code, result.message, res, request);
  }
}

export async function handleGetPaymentAddress(req, res) {
  const request = parseRequest(req);
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw {
        code: 400,
        message: errors.array()
      }
    }
    // check if user has an unpaid payment address assigned
    // if they do, return it
    // if they dont, assign one and return it
    let status = false
    
    const response = {
      status
    };

    respond(200, response, res, request);
  }
  catch (e) {
    const result = filterError(e, r_500, request);
    respond(result.code, result.message, res, request);
  }
}

export async function handleGetPaymentStatus(req, res) {
  const request = parseRequest(req);
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw {
        code: 400,
        message: errors.array()
      }
    }

    // get local payment history from db
    let status = [];
  
    const response = {
      status
    };

    respond(200, response, res, request);
  }
  catch (e) {
    const result = filterError(e, r_500, request);
    respond(result.code, result.message, res, request);
  }
}

export async function handlePostPaymentNotification(req, res) {
  const request = parseRequest(req);
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw {
        code: 400,
        message: errors.array()
      }
    }

    // CALL BACK FUNCTION TRIGGERED BY NODE TX WATCHER
    let status = [];
  
    const response = {
      message: "Cyphernode Rocks!"
    };

    console.log({response})

    respond(200, response, res, request);
  }
  catch (e) {
    const result = filterError(e, r_500, request);
    respond(result.code, result.message, res, request);
  }
}
