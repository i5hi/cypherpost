/*
cypherpost.io
Developed @ Stackmate India
*/
import { CypherpostBitcoinOps } from "../../lib/bitcoin/bitcoin";
import { S5Crypto } from "../../lib/crypto/crypto";
import { r_500 } from "../../lib/logger/winston";
import { filterError, parseRequest, respond } from "../../lib/server/handler";
import { CypherpostBadges } from "../badges/badges";
import { CypherpostPostKeys } from "../posts/keys/post_keys";
import { CypherpostPosts } from "../posts/posts";
import { CypherpostIdentity } from "./identity";

const { validationResult } = require('express-validator');

const identity = new CypherpostIdentity();
const badges = new CypherpostBadges();
const posts = new CypherpostPosts();
const posts_keys = new CypherpostPostKeys();
const bitcoin = new CypherpostBitcoinOps();

const crypto = new S5Crypto();

export async function identityMiddleware(req, res, next) {
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

    // console.log({message});
    // console.log({signature});
    // console.log({pubkey});
    
    let verified = await bitcoin.verify(message, signature, pubkey);
    if (verified instanceof Error) throw verified;
    else if (!verified) throw{
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

    let status = await identity.register(request.body.username, request.headers['x-client-pubkey']);
    if (status instanceof Error) throw status;
    
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

    const genesis_filter = request.query['genesis_filter']?request.query['genesis_filter']:0;
    const identities = await identity.all(genesis_filter);
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

export async function handleDeleteIdentity(req, res) {
  const request = parseRequest(req);

  try {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw {
        code: 400,
        message: errors.array()
      }
    }

    // remove identity xpub from :
    // profile + keys
    // posts + keys
    // preferences 
    // badges
    // identities

    const rm_posts = await posts.removeAllByOwner(request.headers['x-client-pubkey']);
    if(rm_posts instanceof Error) throw rm_posts;

    const rm_post_keys = await posts_keys.removeAllPostDecryptionKeyOfUser(request.headers['x-client-pubkey']);
    if (rm_post_keys instanceof Error) throw rm_post_keys;

    const rm_badges = await badges.removeAllOfUser(request.headers['x-client-pubkey'])
    if (rm_badges instanceof Error) throw rm_badges;

    const rm_identity = await identity.remove(request.headers['x-client-pubkey']);
    if (rm_identity instanceof Error) throw rm_identity;
    
    const response = {
      status: true
    };

    respond(200, response, res, request);
  }
  catch (e) {
    const result = filterError(e, r_500, request);
    respond(result.code, result.message, res, request);
  }
}

export async function handleGetServerIdentity(req, res) {
  const request = parseRequest(req);

  try {
    const keys = await crypto.readECDHPairFromFile();
    if(keys instanceof Error) throw keys;
    
    const response = {
      pubkey: keys.pubkey
    };

    respond(200, response, res, request);
  }
  catch (e) {
    const result = filterError(e, r_500, request);
    respond(result.code, result.message, res, request);
  }
}