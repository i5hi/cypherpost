/*
cypherpost.io
Developed @ Stackmate India
*/
import { S5Crypto } from "../../lib/crypto/crypto";
import { handleError } from "../../lib/errors/e";
import { S5LocalJWT } from "../../lib/jwt/jwt";
import { r_500 } from "../../lib/logger/winston";
import { filterError, parseRequest, respond } from "../../lib/server/handler";
import { LionBitKeys } from "../keys/keys";
import { LionBitPosts } from "./posts";
const { validationResult } = require('express-validator');

const s5crypto = new S5Crypto();
const server_rsa_filename = "sats_sig";
const posts = new LionBitPosts();
const keys = new LionBitKeys();

const local_jwt = new S5LocalJWT();

export async function postMiddleware(req, res, next) {
  const request = parseRequest(req);

  try {

      let token = req.headers['authorization'];
      
      if (token===undefined || token === "")
      throw handleError({
        code: 401,
        message: "Invalid token"
      });

      token = token.slice(7, token.length);
      
      const decoded = await local_jwt.verify(token);
      if (decoded instanceof Error) throw decoded;

      const audience = decoded.aud.split(",");
      if(audience.includes("posts")){
        req.headers['user'] = decoded['payload']['user'];
        next();
      }
      else{
        throw handleError({
          code: 401,
          message: "Token not allowed to access posts."
        });
  
      }
  }
  catch (e) {
    const result = filterError(e, r_500, request);
    respond(result.code, result.message, res, request);
  }
}

export async function handleCreatePost(req, res) {
  const request = parseRequest(req);

  try {


    
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw {
        code: 400,
        message: errors.array() 
      }
    }

    const post = await posts.create(req.headers['user'], req.body.expiry, req.body.cipher_json, req.body.derivation_scheme,req.body.decryption_keys);
    if (post instanceof Error) throw post;
    const response = {
     post
    };

    respond(200, response, res, request);
  }
  catch (e) {
    const result = filterError(e, r_500, request);
    respond(result.code, result.message, res, request);
  }
}


export async function handleGetMyPosts(req, res) {
  const request = parseRequest(req);

  try {

    
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw {
        code: 400,
        message: errors.array() 
      }
    }

    const my_posts = await posts.find(req.headers['user']);
    if (my_posts instanceof Error) throw my_posts;

    const response = {
      posts: my_posts
    };
    respond(200, response, res, request);

  }
  catch (e) {
    const result = filterError(e, r_500, request);
    respond(result.code, result.message, res, request);
  }
}
export async function handleGetOthersPosts(req, res) {
  const request = parseRequest(req);

  try {
    
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw {
        code: 400,
        message: errors.array() 
      }
    }
    
    const my_keys = await keys.find(req.headers['user']);
    if(my_keys instanceof Error) throw my_keys;

    const allowed_posts = my_keys.post_keys.map(post_key => post_key.id);
    if(allowed_posts instanceof Error) throw allowed_posts;

    const others_posts = await posts.findMany(allowed_posts);
    if(others_posts instanceof Error) throw others_posts;

    const response = {
      posts:others_posts
    };
    
    respond(200, response, res, request);

  

  }
  catch (e) {
    const result = filterError(e, r_500, request);
    respond(result.code, result.message, res, request);
  }
}

export async function handleDeletePost(req, res) {
  const request = parseRequest(req);

  try {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw {
        code: 400,
        message: errors.array() 
      }
    }

    const status = await posts.remove(req.params.id);
    if(status instanceof Error) throw status;

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
