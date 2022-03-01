/*
cypherpost.io
Developed @ Stackmate India
*/
import { r_500 } from "../../lib/logger/winston";
import { filterError, parseRequest, respond } from "../../lib/server/handler";
import { CypherpostIdentity } from "../identity/identity";
import { PostKeyStoreUpdate } from "./keys/interface";
import { CypherpostPostKeys } from "./keys/post_keys";
import { CypherpostPosts } from "./posts";
const { validationResult } = require('express-validator');

const posts = new CypherpostPosts();
const identity = new CypherpostIdentity();
const postKeys = new CypherpostPostKeys();

export async function postMiddleware(req, res, next) {
  const request = parseRequest(req);
  try {
    const signature = request.headers['x-client-signature'];
    const pubkey = request.headers['x-client-pubkey'];
    // CHECK SIG AND PUBKEY FORMAT - RETURNS 500 IF NOT VALID
    const nonce = request.headers['x-nonce'];
    const method = request.method;
    const resource = request.resource;
    const body = request.body ? JSON.stringify(request.body) : "{}";
    const message = `${method} ${resource} ${body} ${nonce}`;

    const status = await identity.verify(pubkey, message, signature);
    // console.log({pubkey,signature,message,status})

    if (status instanceof Error) throw status;
    else next();
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

    const id = await posts.create(req.headers['x-client-pubkey'], req.body.expiry, req.body.cypher_json, req.body.derivation_scheme, req.body.reference);
    if (id instanceof Error) throw id;

    const response = {
      id
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

    const ids_removed = await posts.removeAllExpiredByOwner(req.headers['x-client-pubkey']);
    if (ids_removed instanceof Error) throw ids_removed;

    if (ids_removed.length > 0)
      ids_removed.map((id) => {
        let status = postKeys.removePostDecryptionKeyById(req.headers['x-client-pubkey'], id);
        if (status instanceof Error) {
          console.error("ERRORED WHILE DELETING EXPIRED POST KEYS", { status });
          throw status
        };
      });

    const genesis_filter = request.query['genesis_filter'] ? request.query['genesis_filter'] : 0;

    const my_posts = await posts.findAllByOwner(req.headers['x-client-pubkey'], genesis_filter);
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
    // find my trusted_by list of xpubs
    // find their posts

    const genesis_filter = request.query['genesis_filter'] ? request.query['genesis_filter'] : 0;

    const reciever_keys = await postKeys.findPostDecryptionKeyByReciever(req.headers['x-client-pubkey'], genesis_filter);
    if (reciever_keys instanceof Error) throw reciever_keys;

    const posts_recieved = await posts.findManyById(reciever_keys.map(key => key.post_id), genesis_filter);
    if (posts_recieved instanceof Error) throw posts_recieved;
    let expired_ids = [];

    posts_recieved.map(post => {
      if (post.expiry < Date.now() && post.expiry != 0)
        expired_ids.push(post.id);
    });

    const ids_removed = await posts.removeManyById(expired_ids);
    if (ids_removed instanceof Error) throw ids_removed;

    if (expired_ids.length > 0)
      expired_ids.map((id) => {
        let status = postKeys.removePostDecryptionKeyById(req.headers['x-client-pubkey'], id);
        if (status instanceof Error) {
          console.error("ERRORED WHILE DELETING EXPIRED POST KEYS", { status });
          throw status
        };
      });

    const posts_and_keys = [];

    posts_recieved.filter(function (post) {
      const key = reciever_keys.find(key => key.post_id === post.id);
      key ? posts_and_keys.push({ ...post, decryption_key: key.decryption_key }) : null;
    });

    const response = {
      posts: posts_and_keys,
    };

    respond(200, response, res, request);
  }
  catch (e) {
    const result = filterError(e, r_500, request);
    respond(result.code, result.message, res, request);
  }
}

export async function handleDeletePostAndReferenceKeys(req, res) {
  const request = parseRequest(req);
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw {
        code: 400,
        message: errors.array()
      }
    }

    let status = await posts.removeOneById(req.params.id, request.headers['x-client-pubkey']);
    if (status instanceof Error) throw status;

    status = await postKeys.removePostDecryptionKeyById(request.headers['x-client-pubkey'], req.params.id);
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

export async function handlePutKeys(req, res) {
  const request = parseRequest(req);
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw {
        code: 400,
        message: errors.array()
      }
    }

    const decryption_keys: PostKeyStoreUpdate[] = request.body.decryption_keys.map((key) => {
      return {
        decryption_key: key['decryption_key'],
        reciever: key['reciever']
      }
    });

    const status = await postKeys.addPostDecryptionKeys(request.headers['x-client-pubkey'], req.body.post_id, decryption_keys);
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