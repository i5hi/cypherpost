/*
cypherpost.io
Developed @ Stackmate India
*/

import { S5Crypto } from "../../lib/crypto/crypto";
import { handleError } from "../../lib/errors/e";
import { S5LocalJWT } from "../../lib/jwt/jwt";
import { r_500 } from "../../lib/logger/winston";
import { filterError, parseRequest, respond } from "../../lib/server/handler";
import { LionBitAuth } from "../auth/auth";
import { LionBitKeys } from "../keys/keys";
import { LionBitPosts } from "../posts/posts";
import { UserProfile } from "./interface";
import { LionBitProfile } from "./profile";
const { validationResult } = require('express-validator');

// const auth = new LionBitProfile();
const s5crypto = new S5Crypto();
const server_rsa_filename = "sats_sig";
const profile = new LionBitProfile();
const keys = new LionBitKeys();
const auth = new LionBitAuth();
const posts = new LionBitPosts();
const local_jwt = new S5LocalJWT();

export async function profileMiddleware(req, res, next) {
  const request = parseRequest(req);

  try {
    console.log(req.originalUrl);
    if (req.originalUrl.split("?").shift() == "/api/v1/profile/usernames" || req.originalUrl == "/api/v1/profile/usernames/") {
      if (req.headers['authorization']) {
        let token = req.headers['authorization'];

        if (token === undefined || token === "")
          throw handleError({
            code: 401,
            message: "Invalid token"
          });

        token = token.slice(7, token.length);

        const decoded = await local_jwt.verify(token);
        if (decoded instanceof Error) throw decoded;

        const audience = decoded.aud.split(",");
        if (audience.includes("profile")) {
          req.headers['user'] = decoded['payload']['user'];
          next();
        }
        else {
          throw handleError({
            code: 401,
            message: "Token not allowed to access profile."
          });
        }
      }
      else {
        const invite_code = req.query.invite_code;
        const invited_by = req.query.invited_by;
        const invite_status = await auth.check_invite(invited_by, invite_code);
        if (invite_status instanceof Error) throw invite_status;
        if (!invite_status) throw {
          code: 401,
          message: "Invalid Invitation"
        };
        else {
          next();
        }
      }
    }
    else {
      let token = req.headers['authorization'];

      if (token === undefined || token === "")
        throw handleError({
          code: 401,
          message: "Invalid token"
        });

      token = token.slice(7, token.length);

      const decoded = await local_jwt.verify(token);
      if (decoded instanceof Error) throw decoded;

      const audience = decoded.aud.split(",");
      if (audience.includes("profile")) {
        req.headers['user'] = decoded['payload']['user'];
        next();
      }
      else {
        throw handleError({
          code: 401,
          message: "Token not allowed to access profile."
        });

      }
    }
  }
  catch (e) {
    const result = filterError(e, r_500, request);
    respond(result.code, result.message, res, request);
  }
}


export async function handlePostGenesis(req, res) {
  const request = parseRequest(req);

  try {


    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw {
        code: 400,
        message: errors.array()
      }
    }

    const status = await profile.genesis(request.headers['user'], request.body.derivation_scheme, request.body.recipient_xpub);
    if (status instanceof Error) throw status;

    const new_profile = await profile.find(request.headers['user']);
    if (new_profile instanceof Error) throw new_profile;

    const self_keys = await keys.find(request.headers['user']);
    if (self_keys instanceof Error) throw self_keys;

    // const trusting_keys = await keys.findMany(user_profile.trusting.map(e=>e.username))
    // if(trusting_keys instanceof Error) throw trusting_keys;

    const response = {
      profile: new_profile,
      keys: self_keys,
    };

    respond(200, response, res, request);
  }
  catch (e) {
    const result = filterError(e, r_500, request);
    respond(result.code, result.message, res, request);
  }
}


export async function handleGetProfile(req, res) {
  const request = parseRequest(req);

  try {


    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw {
        code: 400,
        message: errors.array()
      }
    }
    console.log({query:request.query.username});
    const username = (request.query.username) ? request.query.username : request.headers['user'];

    const user_profile = await profile.find(username);
    if (user_profile instanceof Error) throw user_profile;

    // user could use self username as query param
    // make new route?
    if (request.query.username === undefined) {
      const self_keys = await keys.find(request.headers['user']);
      if (self_keys instanceof Error) throw self_keys;

      // const trusting_keys = await keys.findMany(user_profile.trusting.map(e=>e.username))
      // if(trusting_keys instanceof Error) throw trusting_keys;

      const response = {
        profile: user_profile,
        keys: self_keys,
      };
      respond(200, response, res, request);

    }
    else {
      const others_keys = await keys.find(username);
      if (others_keys instanceof Error) throw others_keys;

      const response = {
        profile: user_profile,
        recipient_xpub: others_keys.recipient_xpub
      };
      respond(200, response, res, request);
    }
    // find all trusting recipient_xpubs


  }
  catch (e) {
    const result = filterError(e, r_500, request);
    respond(result.code, result.message, res, request);
  }
}
export async function handleGetManyProfiles(req, res) {
  const request = parseRequest(req);

  try {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw {
        code: 400,
        message: errors.array()
      }
    }
    // console.log({query:request.query.username});

    const user_profiles = await profile.findMany(req.body.usernames);
    if (user_profiles instanceof Error) throw user_profiles;

    const user_keys = await keys.findMany(req.body.usernames);
    if (user_keys instanceof Error) throw user_keys;

    const response = {
      profiles: user_profiles,
      keys: user_keys
    }
    respond(200, response, res, request);



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

    let update: UserProfile = {};

    if (request.body.nickname!=="") update['nickname'] = request.body.nickname;
    if (request.body.status!=="") update['status'] = request.body.status;
    if (request.body.cipher_info!=="") update['cipher_info'] = request.body.cipher_info;

    const user_profile = await profile.update(request.headers['user'], update);
    if (user_profile instanceof Error) throw user_profile;

    const response = {
      profile: user_profile
    };

    respond(200, response, res, request);
  }
  catch (e) {
    const result = filterError(e, r_500, request);
    respond(result.code, result.message, res, request);
  }
}

export async function handleTrustUser(req, res) {
  const request = parseRequest(req);

  try {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw {
        code: 400,
        message: errors.array()
      }
    }

    if(request.body.trusting === request.headers['user']) throw {
      code: 409,
      message: "Trust in self is implied."
    };

    const status = await profile.trust(request.headers['user'], request.body.trusting, request.body.decryption_key, request.body.signature);
    if (status instanceof Error) throw status;

    const updated = await profile.find(request.headers['user']);
    if (updated instanceof Error) throw updated;

    const response = {
      profile: updated
    };

    respond(200, response, res, request);
  }
  catch (e) {
    const result = filterError(e, r_500, request);
    respond(result.code, result.message, res, request);
  }
}

export async function handleRevokeTrustUser(req, res) {
  const request = parseRequest(req);

  try {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw {
        code: 400,
        message: errors.array()
      }
    }

    const status = await profile.revoke(request.headers['user'], request.body.revoking, request.body.decryption_keys, request.body.derivation_scheme, request.body.cipher_info);
    if (status instanceof Error) throw status;

    const updated = await profile.find(request.headers['user']);
    if (updated instanceof Error) throw updated;

    const response = {
      profile: updated
    };

    respond(200, response, res, request);
  }
  catch (e) {
    const result = filterError(e, r_500, request);
    respond(result.code, result.message, res, request);
  }
}


export async function handleMuteUser(req, res) {
  const request = parseRequest(req);

  try {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw {
        code: 400,
        message: errors.array()
      }
    }

    const status = await profile.mute(request.headers['user'], request.body.trusted_by, request.body.toggle_mute);
    if (status instanceof Error) throw status;

    const updated = await profile.find(request.headers['user']);
    if (updated instanceof Error) throw updated;

    const response = {
      profile: updated
    };

    respond(200, response, res, request);
  }
  catch (e) {
    const result = filterError(e, r_500, request);
    respond(result.code, result.message, res, request);
  }
}

export async function handleGetUsernames(req, res) {
  const request = parseRequest(req);

  try {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw {
        code: 400,
        message: errors.array()
      }
    }

    const usernames = await auth.taken_usernames();
    if (usernames instanceof Error) throw usernames;

    const response = {
      usernames
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
    if (request.params.username === undefined) {
      throw {
        code: 400,
        message: "No username specified."
      }
    }
    else {

      const user_profile = await profile.find(request.headers['user']);
      if(user_profile instanceof Error) throw user_profile;

      const user_posts = await posts.find(request.headers['user']);
      if(user_posts instanceof Error) throw user_posts;

      user_profile.trusting.map(async (trusting) => {
        await keys.remove_profile_key(trusting.username,request.headers['user']);
        user_posts.map(async (post) => {
          await keys.remove_post_key(trusting.username, post.id);
        });
      });

      let status = await profile.remove(request.headers['user']);
      if(status instanceof Error) throw status;

      status = await keys.remove(request.headers['user']);
      if(status instanceof Error) throw status;

      status = await posts.removeByUser(request.headers['user']);
      if(status instanceof Error) throw status;

      status = await auth.remove(request.headers['user']);
      if(status instanceof Error) throw status;
      
      const response = {
        status
      };
  
      respond(200, response, res, request);
    }

  }
  catch (e) {
    const result = filterError(e, r_500, request);
    respond(result.code, result.message, res, request);
  }
}

