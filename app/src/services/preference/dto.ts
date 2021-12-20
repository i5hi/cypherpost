/*
cypherpost.io
Developed @ Stackmate India
*/
import { r_500 } from "../../lib/logger/winston";
import { filterError, parseRequest, respond } from "../../lib/server/handler";
import { CypherpostIdentity } from "../identity/identity";
import { CypherpostPreference } from "./preference";

const { validationResult } = require('express-validator');

const identity = new CypherpostIdentity();
const preference = new CypherpostPreference();

export async function preferenceMiddleware(req, res, next) {
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

export async function handleSetPreference(req,res){
  const request = parseRequest(req);

  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw {
        code: 400,
        message: errors.array()
      }
    }

    const status = await preference.update(req.headers['x-client-xpub'], request.body.cypher_json);
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

export async function handleReadPreference(req,res){
  const request = parseRequest(req);

  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw {
        code: 400,
        message: errors.array()
      }
    }

    const result = await preference.find(req.headers['x-client-xpub']);
    if (result instanceof Error) throw result;

    const response = {
      preference: result
    };
    respond(200, response, res, request);
  }
  catch (e) {
    const result = filterError(e, r_500, request);
    respond(result.code, result.message, res, request);
  }
}