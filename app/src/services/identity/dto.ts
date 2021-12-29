/*
cypherpost.io
Developed @ Stackmate India
*/
import { CypherpostBitcoinOps } from "../../lib/bitcoin/bitcoin";
import { r_500 } from "../../lib/logger/winston";
import { filterError, parseRequest, respond } from "../../lib/server/handler";
import { CypherpostBadges } from "../badges/badges";
import { CypherpostPostKeys } from "../posts/keys/post_keys";
import { CypherpostPosts } from "../posts/posts";
import { CypherpostPreference } from "../preference/preference";
import { CypherpostProfileKeys } from "../profile/keys/profile_keys";
import { CypherpostProfile } from "../profile/profile";
import { CypherpostIdentity } from "./identity";

const { validationResult } = require('express-validator');

const identity = new CypherpostIdentity();
const profile =  new CypherpostProfile();
const preference = new CypherpostPreference();
const badges = new CypherpostBadges();
const posts = new CypherpostPosts();
const profile_keys = new CypherpostProfileKeys();
const posts_keys = new CypherpostPostKeys();

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

    console.log({message});
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

    status = await preference.initialize(request.headers['x-client-xpub']);
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
    const rm_profile = await profile.remove(request.headers['x-client-xpub']);
    if(rm_profile instanceof Error) throw rm_profile;
    
    const rm_profile_keys = await profile_keys.removeAllProfileDecryptionKeyOfUser(request.headers['x-client-xpub']);
    if(rm_profile_keys instanceof Error) throw rm_profile_keys;

    const rm_posts = await posts.removeAllByOwner(request.headers['x-client-xpub']);
    if(rm_posts instanceof Error) throw rm_posts;

    const rm_post_keys = await posts_keys.removeAllPostDecryptionKeyOfUser(request.headers['x-client-xpub']);
    if (rm_post_keys instanceof Error) throw rm_post_keys;

    const rm_preferences = await preference.remove(request.headers['x-client-xpub']);
    if (rm_preferences instanceof Error) throw rm_preferences;

    const rm_badges = await badges.removeAllOfUser(request.headers['x-client-xpub'])
    if (rm_badges instanceof Error) throw rm_badges;

    const rm_identity = await identity.remove(request.headers['x-client-xpub']);
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
