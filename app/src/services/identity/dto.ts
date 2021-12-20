/*
cypherpost.io
Developed @ Stackmate India
*/
import { CypherpostBitcoinOps } from "../../lib/bitcoin/bitcoin";
import { r_500 } from "../../lib/logger/winston";
import { filterError, parseRequest, respond } from "../../lib/server/handler";
import { CypherpostPreferences } from "../preferences/preferences";
import { CypherpostProfile } from "../profile/profile";
import { CypherpostIdentity } from "./identity";

const { validationResult } = require('express-validator');

const identity = new CypherpostIdentity();
const profile =  new CypherpostProfile();
const preferences = new CypherpostPreferences();
const bitcoin = new CypherpostBitcoinOps();

export async function identityMiddleware(req, res, next) {
  const request = parseRequest(req);
  try {
    const signature = request.headers['x-client-signature'];
    const xpub = request.headers['x-client-xpub'];
    const nonce = request.headers['x-nonce'];
    const method = request.method;
    const resource = request.resource;
    const body = JSON.stringify(request.body);
    const message = `${method} ${resource} ${body} ${nonce}`;

    // console.log({message});
    const pubkey = bitcoin.extract_ecdsa_pub(xpub);
    if(pubkey instanceof Error) return pubkey;
    
    let verified = bitcoin.verify(message, signature, pubkey);
    if (verified instanceof Error) throw verified;
    if (!verified) throw{
      code: 401,
      message: "Invalid Request Signature."
    };
    
    else next();
  }
  catch (e) {
    const result = filterError(e, r_500, request);
    respond(result.code, result.message, res, request);
  }
}

export async function handleRegistration(req, res) {
  const request = parseRequest(req);
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw {
        code: 400,
        message: errors.array()
      }
    }

    let status = await identity.register(request.body.username, request.headers['x-client-xpub']);
    if (status instanceof Error) throw status;

    status = await profile.initialize(request.headers['x-client-xpub']);
    if (status instanceof Error) throw status;

    status = await preferences.initialize(request.headers['x-client-xpub']);
    if (status instanceof Error ) throw status;

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

export async function handleGetAllIdentities(req, res) {
  const request = parseRequest(req);

  try {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw {
        code: 400,
        message: errors.array()
      }
    }

    const identities = await identity.all();
    if (identities instanceof Error) throw identities;

    const response = {
      identities
    };

    respond(200, response, res, request);
  }
  catch (e) {
    const result = filterError(e, r_500, request);
    respond(result.code, result.message, res, request);
  }
}