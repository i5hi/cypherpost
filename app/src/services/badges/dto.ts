/*
cypherpost.io
Developed @ Stackmate India
*/
import { r_500 } from "../../lib/logger/winston";
import { filterError, parseRequest, respond } from "../../lib/server/handler";
import { CypherpostIdentity } from "../identity/identity";
import { CypherpostBadges } from "./badges";
import { BadgeType } from "./interface";

const { validationResult } = require('express-validator');

const identity = new CypherpostIdentity();
const badges = new CypherpostBadges();

export async function badgesMiddleware(req, res, next) {
  const request = parseRequest(req);
  try {
    const signature = request.headers['x-client-signature'];
    const xpub = request.headers['x-client-xpub'];
    const nonce = request.headers['x-nonce'];
    const method = request.method;
    const resource = request.resource;
    const params = JSON.stringify(request.params);
    const message = `${method} ${resource} ${params} ${nonce}`;

    const status = await identity.verify(xpub, message, signature);
    if (status instanceof Error) throw status;
    else next();
  }
  catch (e) {
    const result = filterError(e, r_500, request);
    respond(result.code, result.message, res, request);
  }
}

export async function handleGetMyBadges(req, res) {
  const request = parseRequest(req);
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw {
        code: 400,
        message: errors.array()
      }
    }

    const given = await badges.findByGiver(request.headers['x-client-xpub']);
    if (given instanceof Error) throw given;
    const recieved = await badges.findByReciever(request.headers['x-client-xpub']);
    if (recieved instanceof Error) throw recieved;

    const response = {
      given,
      recieved
    };

    respond(200, response, res, request);
  }
  catch (e) {
    const result = filterError(e, r_500, request);
    respond(result.code, result.message, res, request);
  }
}

export async function handleGetAllBadges(req, res) {
  const request = parseRequest(req);
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw {
        code: 400,
        message: errors.array()
      }
    }

    const result = await badges.getAll();
    if (result instanceof Error) throw result;

    const response = {
      badges: result,
    };

    respond(200, response, res, request);
  }
  catch (e) {
    const result = filterError(e, r_500, request);
    respond(result.code, result.message, res, request);
  }
}

export async function handleTrust(req, res) {
  const request = parseRequest(req);
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw {
        code: 400,
        message: errors.array()
      }
    }
    if (request.headers['x-client-signature'] === request.body.trusting) {
      throw {
        code: 400,
        message: "Trust in self implied."
      }
    }
    let status = await badges.create(request.headers['x-client-xpub'], request.body.trusting, BadgeType.Trusted, request.headers['x-nonce'], request.body.signature);
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

export async function handleRevokeTrust(req, res) {
  const request = parseRequest(req);
  try {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw {
        code: 400,
        message: errors.array()
      }
    }

    let status = await badges.revoke(request.headers['x-client-xpub'], request.body.trusting, BadgeType.Trusted);
    if (status instanceof Error) throw status;
    // REMOVE ALL RELATED KEYS
    
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