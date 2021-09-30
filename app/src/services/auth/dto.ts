/*
cypherpost.io
Developed @ Stackmate India
*/
import { S5Crypto } from "../../lib/crypto/crypto";
import { handleError } from "../../lib/errors/e";
import * as jwt from "../../lib/jwt/jwt";
import { r_500 } from "../../lib/logger/winston";
import { filterError, parseRequest, respond } from "../../lib/server/handler";
import { LionBitAuth } from "./auth";

const local_jwt = new jwt.S5LocalJWT();

const { validationResult } = require('express-validator');

const auth = new LionBitAuth();
const s5crypto = new S5Crypto();
const server_rsa_filename = "sats_sig";


export async function authMiddleware(req, res, next) {
  const request = parseRequest(req);

  try {
    if(req.originalUrl == "/api/v1/auth/invite/" || 
      req.originalUrl == "/api/v1/auth/invite" ||
      req.originalUrl == "/api/v1/auth/check/seed256/" ||
      req.originalUrl == "/api/v1/auth/check/seed256"
      ){

      let token = req.headers['authorization'];

      if (token===undefined || token === "")
      throw handleError({
        code: 401,
        message: "Invalid token"
      });

      token = token.slice(7, token.length);
      
      const decoded = await local_jwt.verify(token);
      if (decoded instanceof Error) throw decoded;
      
      
      req.headers['user'] = decoded['payload']['user'];
      next();
    }
    else{
      next();
    }
  }
  catch (e) {
    const result = filterError(e, r_500, request);
    respond(result.code, result.message, res, request);
  }
}

export async function handlePostRegistration(req, res) {
  const request = parseRequest(req);

  try {

    
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw {
        code: 400,
        message: errors.array() 
      }
    }

    const token = await auth.register(request.body.username, request.body.pass256, request.body.seed256, request.body.invited_by,request.body.invite_code);
    if(token instanceof Error ) throw token;

    const response = {
      token
    };

    respond(200, response, res, request);
  }
  catch (e) {
    const result = filterError(e, r_500, request);
    respond(result.code, result.message, res, request);
  }
}

export async function handlePostLogin(req, res) {
  const request = parseRequest(req);

  try {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw {
        code: 400,
        message: errors.array() 
      }
    }


    const token = await auth.login(request.body.username, request.body.pass256);
    if(token instanceof Error ) throw token;

    const response = {
      token
    };

    respond(200, response, res, request);
  }
  catch (e) {
    const result = filterError(e, r_500, request);
    respond(result.code, result.message, res, request);
  }
}

export async function handlePostReset(req, res) {
  const request = parseRequest(req);

  try {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw {
        code: 400,
        message: errors.array() 
      }
    }

    const token = await auth.reset(request.body.seed256, request.body.pass256);
    if(token instanceof Error ) throw token;

    const response = {
      token
    };
    
    respond(200, response, res, request);
  }
  catch (e) {
    const result = filterError(e, r_500, request);
    respond(result.code, result.message, res, request);
  }
}

export async function handleGetInvite(req, res) {
  const request = parseRequest(req);

  try {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw {
        code: 400,
        message: errors.array() 
      }
    }
    // console.log({request});

    const invite_code = await auth.invite(request.headers['user']);
    if(invite_code instanceof Error ) throw invite_code;

    const response = {
      invite_code
    };
    
    respond(200, response, res, request);
  }
  catch (e) {
    const result = filterError(e, r_500, request);
    respond(result.code, result.message, res, request);
  }
}

export async function handlePostCheckSeed256(req, res) {
  const request = parseRequest(req);

  try {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw {
        code: 400,
        message: errors.array() 
      }
    }

    const status = await auth.check_seed256(request.headers['user'], request.body.seed256);
    if(status instanceof Error ) throw status;

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