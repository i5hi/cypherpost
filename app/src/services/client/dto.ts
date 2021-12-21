/*
cypherpost.io
Developed @ Stackmate India
*/

import * as fs from "fs";
import * as path from "path";
import { logger, r_500 } from "../../lib/logger/winston";
import { filterError, parseRequest, respond } from "../../lib/server/handler";
import { S5UID } from "../../lib/uid/uid";
const uid = new S5UID();

const base_path = `/home/node/cypherpost/app/src/services/client/public`

export async function adminMiddleWare(req, res, next) {
  try {
    next();
  } catch (e) {
    logger.debug(e);
    const result = filterError(e, r_500, {
      resource: req.originalUrl,
      ip: (req.headers["x-forwarded-for"]) ? (req.headers["x-forwarded-for"]) : req.ip
    });
    respond(result.code, result.message, res, req);
  }
}
export async function handleGetLandingPage(req, res) {
  const request = parseRequest(req);
  try {
    const exists = fs.existsSync(`${base_path}/index.html`);
    if (!exists) throw { code: 404, message: { html_exists_at_path: exists } };

    res.sendFile(path.join(base_path, "/index.html"));
  } catch (e) {
    let result = filterError(e, r_500, request);
    logger.debug({
      e
    });
    respond(result.code, result.message, res, request);
  }
}
export async function handleGetRegistrationPage(req, res) {
  const request = parseRequest(req);
  try {
    const exists = fs.existsSync(`${base_path}/registration.html`);
    if (!exists) throw { code: 404, message: { html_exists_at_path: exists } };

    res.sendFile(path.join(base_path, "/registration.html"));
  } catch (e) {
    let result = filterError(e, r_500, request);
    logger.debug({
      e
    });
    respond(result.code, result.message, res, request);
  }
}
export async function handleGetLoginPage(req, res) {
  const request = parseRequest(req);
  try {
    const exists = fs.existsSync(`${base_path}/login.html`);
    if (!exists) throw { code: 404, message: { html_exists_at_path: exists } };

    res.sendFile(path.join(base_path, "/login.html"));
  } catch (e) {
    let result = filterError(e, r_500, request);
    logger.debug({
      e
    });
    respond(result.code, result.message, res, request);
  }
}
export async function handleGetResetPage(req, res) {
  const request = parseRequest(req);
  try {
    const exists = fs.existsSync(`${base_path}/reset.html`);
    if (!exists) throw { code: 404, message: { html_exists_at_path: exists } };

    res.sendFile(path.join(base_path, "/reset.html"));
  } catch (e) {
    let result = filterError(e, r_500, request);
    logger.debug({
      e
    });
    respond(result.code, result.message, res, request);
  }
}
export async function handleGetProfilePage(req, res) {
  const request = parseRequest(req);
  try {
    const exists = fs.existsSync(`${base_path}/profile.html`);
    if (!exists) throw { code: 404, message: { html_exists_at_path: exists } };

    res.sendFile(path.join(base_path, "/profile.html"));
  } catch (e) {
    let result = filterError(e, r_500, request);
    logger.debug({
      e
    });
    respond(result.code, result.message, res, request);
  }
}
export async function handleGetNetworkPage(req, res) {
  const request = parseRequest(req);
  try {
    const exists = fs.existsSync(`${base_path}/network.html`);
    if (!exists) throw { code: 404, message: { html_exists_at_path: exists } };

    res.sendFile(path.join(base_path, "/network.html"));
  } catch (e) {
    let result = filterError(e, r_500, request);
    logger.debug({
      e
    });
    respond(result.code, result.message, res, request);
  }
}
export async function handleGetPostsPage(req, res) {
  const request = parseRequest(req);
  try {
    const exists = fs.existsSync(`${base_path}/posts.html`);
    if (!exists) throw { code: 404, message: { html_exists_at_path: exists } };

    res.sendFile(path.join(base_path, "/posts.html"));
  } catch (e) {
    let result = filterError(e, r_500, request);
    logger.debug({
      e
    });
    respond(result.code, result.message, res, request);
  }
}

