/*
cypherpost.io
Developed @ Stackmate India
*/
import { S5Crypto } from "../../lib/crypto/crypto";
import { r_500 } from "../../lib/logger/winston";
import { filterError, parseRequest, respond } from "../../lib/server/handler";
import { CypherpostIdentity } from "../identity/identity";
import { PostKeyStoreUpdate } from "./keys/interface";
import { CypherpostPostKeys } from "./keys/post_keys";
import { CypherpostPosts } from "./posts";
const { validationResult } = require('express-validator');

const s5crypto = new S5Crypto();
const posts = new CypherpostPosts();
const identity = new CypherpostIdentity();
const postKeys = new CypherpostPostKeys();

export async function postMiddleware(req, res, next) {
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

    const id = await posts.create(req.headers['x-client-xpub'], req.body.expiry, req.body.cypher_json, req.body.derivation_scheme);
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

    const ids_removed = await posts.removeAllExpiredByOwner(req.headers['x-client-xpub']);
    if (ids_removed instanceof Error) throw ids_removed;

    if(ids_removed.length>0)
    ids_removed.map((id)=>{
      let status = postKeys.removePostDecryptionKeyById(req.headers['x-client-xpub'],id);
      if (status instanceof Error){ 
        console.error("ERRORED WHILE DELETING EXPIRED POST KEYS", {status});
        throw status};
    });

    const my_posts = await posts.findAllByOwner(req.headers['x-client-xpub']);
    if (my_posts instanceof Error) throw my_posts;

    const my_posts_keys = await postKeys.findPostDecryptionKeyByGiver(req.headers['x-client-xpub']);
    if (my_posts_keys instanceof Error) throw my_posts_keys;

    const response = {
      posts: my_posts,
      keys: my_posts_keys
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

    const reciever_keys = await postKeys.findPostDecryptionKeyByReciever(req.headers['x-client-xpub']);
    if (reciever_keys instanceof Error) throw reciever_keys;

    const posts_recieved = await posts.findManyById(reciever_keys.map(key=>key.id));
    if(posts_recieved instanceof Error) throw posts_recieved;
    let expired_ids=[]; 

    posts_recieved.map(post=>{
      if (post.expiry < Date.now() && post.expiry != 0)
      expired_ids.push(post.id);
    });

    const ids_removed = await posts.removeManyById(expired_ids);
    if (ids_removed instanceof Error) throw ids_removed;

    if(expired_ids.length>0)
    expired_ids.map((id)=>{
      let status = postKeys.removePostDecryptionKeyById(req.headers['x-client-xpub'],id);
      if (status instanceof Error){ 
        console.error("ERRORED WHILE DELETING EXPIRED POST KEYS", {status});
        throw status};
    });
    
    const response = {
      posts: posts_recieved,
      keys: reciever_keys
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

    let status = await posts.removeOneById(req.params.id, request.headers['x-client-xpub']);
    if (status instanceof Error) throw status;

    status = await postKeys.removePostDecryptionKeyById(request.headers['x-client-xpub'], req.params.id);
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

export async function handleUpdatePostKeys(req, res) {
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

    const status = await postKeys.addPostDecryptionKeys(request.headers['x-client-xpub'], req.body.id, decryption_keys);
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