/*
cypherpost.io
Developed @ Stackmate India
*/
import { r_500 } from "../../lib/logger/winston";
import { filterError, parseRequest, respond } from "../../lib/server/handler";
import { CypherpostIdentity } from "../identity/identity";
import { ProfileKeyStoreUpdate } from "./keys/interface";
import { CypherpostProfileKeys } from "./keys/profile_keys";
import { CypherpostProfile } from "./profile";

const { validationResult } = require('express-validator');

const identity = new CypherpostIdentity();
const profile = new CypherpostProfile();
const profileKeys = new CypherpostProfileKeys();


export async function profileMiddleware(req, res, next) {
  const request = parseRequest(req);
  try {
    const signature = request.headers['x-client-signature'];
    const xpub = request.headers['x-client-xpub'];
    const nonce = request.headers['x-nonce'];
    const method = request.method;
    const resource = request.resource;
    const body = JSON.stringify(request.body);
    const message = `${method} ${resource} ${body} ${nonce}`;

    const status = await identity.verify(xpub, message, signature);
    if (status instanceof Error) throw status;
    else next();
  }
  catch (e) {
    const result = filterError(e, r_500, request);
    respond(result.code, result.message, res, request);
  }
}

export async function handleUpdateProfile(req, res) {
  const request = parseRequest(req);
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw {
        code: 400,
        message: errors.array()
      }
    }

    const status = await profile.update(request.headers['x-client-xpub'], request.body.derivation_scheme, request.body.cypher_json);
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

export async function handleDeleteProfile(req, res) {
  const request = parseRequest(req);
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw {
        code: 400,
        message: errors.array()
      }
    }

    let status = await profile.remove(request.headers['x-client-xpub']);
    if (status instanceof Error) throw status;

    status = await identity.remove(request.headers['x-client-xpub']);
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

export async function handleGetSelfProfile(req, res) {
  const request = parseRequest(req);
  try {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw {
        code: 400,
        message: errors.array()
      }
    }

    const result = await profile.findOne(request.headers['x-client-xpub']);
    if (result instanceof Error) throw result;

    const keys = await profileKeys.findProfileDecryptionKeyByGiver(request.headers['x-client-xpub']);
    if (keys instanceof Error && keys['name']!="404") throw keys;

    const response = {
      profile: result,
      keys: keys
    };

    respond(200, response, res, request);
  }
  catch (e) {
    const result = filterError(e, r_500, request);
    respond(result.code, result.message, res, request);
  }

}
export async function handleGetOthersProfile(req, res) {
  const request = parseRequest(req);
  try {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw {
        code: 400,
        message: errors.array()
      }
    }

    const keys = await profileKeys.findProfileDecryptionKeyByReciever(request.headers['x-client-xpub']);
    if (keys instanceof Error) {
      throw keys
    };

    const result = await profile.findMany(keys.map(key => key.giver));
    if (result instanceof Error) throw result;

    const response = {
      profiles: result,
      keys: keys
    };

    respond(200, response, res, request);
  }
  catch (e) {
    const result = filterError(e, r_500, request);
    respond(result.code, result.message, res, request);
  }

}

export async function handleUpdateProfileKeys(req, res) {
  const request = parseRequest(req);
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw {
        code: 400,
        message: errors.array()
      }
    }

    const decryption_keys: ProfileKeyStoreUpdate[] = request.body.decryption_keys.map((key) => {
      return {
        decryption_key: key['decryption_key'],
        reciever: key['reciever']
      }
    });

    const status = await profileKeys.addProfileDecryptionKeys(request.headers['x-client-xpub'], decryption_keys);
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

