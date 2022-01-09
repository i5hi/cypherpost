/*
cypherpost.io
Developed @ Stackmate India
*/
// ------------------ '(◣ ◢)' ---------------------
import * as crypto from "crypto";
import * as fs from "fs";
import { handleError } from '../errors/e';
import { logger, r_500 } from "../logger/winston";
import { S5UID } from "../uid/uid";

// ------------------ '(◣ ◢)' ---------------------
const KEY_PATH = `${process.env.HOME}/.keys`;
const KEY_NAME = "sats_sig";

const s5uid = new S5UID();
// ------------------ '(◣ ◢)' ---------------------
// try sending a request without header
export function parseRequest(request: any): S5Request {
  const r_custom: S5Request = {
    method: request.method || "method_error",
    resource: request.originalUrl || "resource_error",
    headers: request.headers || "headers_error",
    body: request.body || "body_error",
    uid: request.headers['uid'] || "private",
    files: request.files || "zil",
    file: request.file || "zil",
    timestamp: Date.now(),
    gmt: new Date(Date.now()).toUTCString(),
    ip: request.headers["x-forwarded-for"] || "ip_error",
    params: request.params || {},
    device: request.headers['user-agent'] || "unknown",
    query: request.query
  };
  return r_custom;
}
// ------------------ '(◣ ◢)' ---------------------
export async function respond(
  status_code: number,
  message: any,
  response: any,
  request: any
) {
  try {
    const sats_id = s5uid.createResponseID();
    const now = Date.now();
    const headers = {
      "x-s5-id": sats_id,
      "x-s5-time": now
    };

    const signature = await getResponseSignature(
      status_code,
      request["resource"],
      request["method"],
      headers,
      message
    );
    if (signature instanceof Error) {
      return signature;
    }
    const headers_with_sig: S5ResponseHeaders = {
      "x-s5-id": sats_id,
      "x-s5-time": now,
      "x-s5-signature": signature
    };
    // logger.info({ user: ((request.uid)?request.uid:"external"), resource: `${request['method']}-${(request["resource"] || request['originalUrl'])}`, status_code })
    return (
      response
        .set(headers_with_sig)
        .status(status_code)
        .send(message)
    );
  } catch (e) {
    logger.error("Ourskirts error at dto respond", e);
    let message = r_500;
    switch (e.code) {
      case 401:
        message = {
          error: e.message
        };
        break;

      case 400:
        message = {
          error: e.message
        };
        break;

      case 500:
        message = {
          error: e.message
        };
        break;

      default:
        message = {
          error: "Internal Signing Error"
        };
        e.code = 500;
        break;
    }
    return (response.status(e.code).send(message));
  }
}
// ------------------ '(◣ ◢)' ---------------------
export async function getResponseSignature(
  status_code: number,
  ep: string,
  method: string,
  headers: S5ResponseHeaders,
  body: S5Output
): Promise<string | Error> {
  try {

    if (fs.existsSync(`${KEY_PATH}/${KEY_NAME}.pem`)) {
      const private_key = fs
        .readFileSync(`${KEY_PATH}/${KEY_NAME}.pem`)
        .toString("ascii");



      const message = `${status_code}-${headers["x-s5-id"]}-${headers["x-s5-time"]}`;

      // RESPONSE WITHOUT BODY

      const sign = crypto.createSign("RSA-SHA256");
      sign.update(message);
      sign.end();

      const signature = sign.sign({ key: private_key, passphrase: "test" }, 'base64');

      const status = await checkResponseSignature(status_code, headers, signature);
      if (status instanceof Error) return status;
      return signature;
    }
    else {
      logger.error("No response signing key found!. Run $ ditto crpf sats_sig")
      return handleError({
        code: 500,
        message: "No response signing key found!"
      })
    }

  } catch (e) {
    logger.error(e);
    return handleError(e);
  }
}
// ------------------ '(◣_◢)' ------------------
export async function checkResponseSignature(
  status_code: number,
  headers: S5ResponseHeaders,
  sig_b64: string // base64
): Promise<boolean | Error> {
  try {
    const signature = Buffer.from(sig_b64, 'base64')

    const public_key = fs
      .readFileSync(`${KEY_PATH}/${KEY_NAME}.pub`)
      .toString("ascii");

    const message = `${status_code}-${headers["x-s5-id"]}-${headers["x-s5-time"]}`;

    const verify = crypto.createVerify("RSA-SHA256");
    verify.update(message);
    // verify.end();

    return (verify.verify(Buffer.from(public_key, 'ascii'), signature));
  }
  catch (e) {
    return handleError(e);
  }
}
// ------------------ '(◣ ◢)' ---------------------
export function filterError(
  e,
  custom_500_message: object,
  request_data: S5Request
): S5Body {
  try {
    let code: number = 500;
    let message = custom_500_message;
    const s_codes = ["202", "400", "401", "402", "403", "404", "406", "409", "415", "420", "422", "429"];
    const n_codes = [202, 400, 401, 402, 403, 404, 406, 409, 415, 420, 422, 429];

    if (e instanceof Error && s_codes.includes(e.name)) {
      code = parseInt(e.name, 10);
    }
    // just to not break old error format

    else if (e.code && typeof (e.code) == 'number') {
      code = e["code"];
    }

    // logger.warn({
    //   code,
    //   resource:request_data.resource,
    //   method: request_data.method,
    //   e: e['message'],
    //   user: (request_data.user) ? request_data.user.email : request_data.ip
    // });
    logger.debug({ e })
    // if(code === 400) logger.debug({e})

    // important that these codes are numbers and not strings
    // node.js erorrs return strings, custom is number, ogay?
    if (n_codes.includes(code)) {
      // Client Errors: Change message from default 500
      // if (code === 400) message = { temp: "Bad body params" }
      // if (code === 401) message = { temp: "Bad authentication" }
      // if (code === 404) message = { temp: "Resource Not Available" }
      // if (code === 409) message = { temp: "Duplicate Entry" }
      // if (code === 409) message = { temp: "Duplicate Entry" }
      if(Array.isArray(e['message'])) message = {array:e['message']}
      if (parseJSONSafely(e["message"])) message = { error: parseJSONSafely(e["message"]) }
      else message = { error: e["message"] }
      


    } else {
      // Server Errors: Leave message as default 500
      // request_data["headers"] = undefined;

      logger.error({
        request: {
          body: request_data['body'],
          resource: request_data['resource'],
          ip: request_data.ip || "no ip",
        },
        e
      });
    }

    return {
      code,
      message
    };
  }
  catch (e) {
    return {
      code: 500,
      message: custom_500_message
    }
  }
}

function parseJSONSafely(str) {
  try {
     return JSON.parse(str);
  }
  catch (e) {
    //  console.log({e});
     // Return a default object, or null based on use case.
     return false
  }
}
// ------------------ '(◣ ◢)' ---------------------
export interface S5RequestHeaders {
  'authorization'?: string;
  'x-s5-totp'?: string;
}
export interface S5ResponseHeaders {
  'x-s5-id': string;
  'x-s5-time': number;
  'x-s5-signature'?: string;
}

export interface S5User {
  uid?: string;
  user?: string;
  firebase_uid?: string;
  email?: string;
  expiry?: number;
  tfa?: boolean;
  ip?: string;
  phone?: string;
}

export interface S5Input {
  username?:string;
  xpub?:string;
  cypher_json?: string;
  nonce?: string;
  pass256?: string;
  seed256?: string;
  pass512?: string;
  invited_by?: string;
  invite_code?:string;
  cipher_info?: string,
  derivation_scheme?: string,
  recipient_xpub?:string,
  decryption_keys?: Array<object>,
  decryption_key?: string,
  trusting?: string,
  trusted_by?: string,
  revoking?: string,
  toggle_mute?: boolean,
  nickname?: string;
  status?: string;
  signature?:string;
  currency?: string;
  amount?: number;
  filter?:object;
  post_id?:string;

};

export interface S5Output {
  sid: string;
}
export interface S5Request {
  headers?: object;
  body?: S5Input;
  method?: string;
  resource?: string;
  ip?: string | string[];
  timestamp?: number;
  gmt?: string;
  uid?: string;
  files?: string | object;
  file?: string | object;
  params?: S5Input;
  device?: string;
  query?: S5Input;
}
export interface S5Body {
  code: number;
  message: object | string;
}
export interface S5Response {
  headers: S5ResponseHeaders;
  body: S5Body
}

// ------------------ '(◣ ◢)' ---------------------