// /*
// cypherpost.io
// Developed @ Stackmate India
// */

// import { handleError } from "../../lib/errors/e";
// import { IdentityTrustRelation, KeyChain, KeyInterface } from "./interface";
// import { MongoKeyStore } from "./mongo";



// const store = new MongoKeyStore();

// export class CypherpostKeys implements KeyInterface {
//   getKeyChain(owner: string[]): Promise<KeyChain[] | Error> {
//     throw new Error("Method not implemented.");
//   }
//   removeKeyChain(owner: string): Promise<boolean | Error> {
//     throw new Error("Method not implemented.");
//   }
//   getIdentityTrustRelation(owner: string): Promise<Error | IdentityTrustRelation[]> {
//     throw new Error("Method not implemented.");
//   }
//   addIdentityKeyRelation(owner: string, reference: string): Promise<boolean | Error> {
//     throw new Error("Method not implemented.");
//   }
//   removeIdentityKeyRelation(owner: string, reference: string): Promise<boolean | Error> {
//     throw new Error("Method not implemented.");
//   }
//   addProfileDecryptionKey(reference: string, owner: string, decryption_key: string): Promise<boolean | Error> {
//     throw new Error("Method not implemented.");
//   }
//   removeProfileDecryptionKey(reference: string): Promise<boolean | Error> {
//     throw new Error("Method not implemented.");
//   }
//   updateProfileDecryptionKey(reference: string, decryption_key: string): Promise<boolean | Error> {
//     throw new Error("Method not implemented.");
//   }
//   addPostDecryptionKey(owner: string, reference: string, decryption_key: string): Promise<boolean | Error> {
//     throw new Error("Method not implemented.");
//   }
//   removePostDecryptionKey(owner: string, id: string): Promise<boolean | Error> {
//     throw new Error("Method not implemented.");
//   }
//   updatePostDecryptionKey(reference: string, decryption_key: string): Promise<boolean | Error> {
//     throw new Error("Method not implemented.");
//   }
//   async remove(username: string): Promise<boolean | Error> {
//     return store.remove(username);
//   }
//   async init(username: string, recipient_xpub: string): Promise<boolean | Error> {
//     return store.create({
//       username,
//       recipient_xpub,
//       post_keys: [],
//       profile_keys: []
//     });
//   }
//   async add_recipient_key(username: string, key: Key): Promise<boolean | Error> {
//     const status = await isUniqueRecipient(username, key);
//     if (status instanceof Error) return status;

//     if (status) {
//       return store.update_push(username, UseCase.Recipient, key)
//     }
//     else {
//       return handleError({
//         code: 409,
//         message: "Key exists."
//       });
//     }

//   }
//   remove_recipient_key(username: string, id: string): Promise<boolean | Error> {
//     return store.update_pull(username, UseCase.Recipient, { id });
//   }
//   async add_profile_key(username: string, key: Key): Promise<boolean | Error> {
//     const status = await isUniqueProfile(username, key);
//     if (status instanceof Error) return status;
//     console.log({status});
//     if (status) {
//       return store.update_push(username, UseCase.Profile, key)
//     }
//     else {
//       return handleError({
//         code: 409,
//         message: "Key exists."
//       });
//     }
//   }
//   remove_profile_key(username: string, id: string): Promise<boolean | Error> {
//     return store.update_pull(username, UseCase.Profile, { id });
//   }
//   async add_post_key(username: string, key: Key): Promise<boolean | Error> {
//     const status = await isUniquePost(username, key);
//     if (status instanceof Error) return status;

//     if (status) {
//       return store.update_push(username, UseCase.Post, key)
//     }
//     else {
//       return handleError({
//         code: 409,
//         message: "Key exists."
//       });
//     }
//   }
//   remove_post_key(username: string, id: string): Promise<boolean | Error> {
//     return store.update_pull(username, UseCase.Post, { id });
//   }

// };

// // EVERY UPDATE KEY REQUIRES READ FIRST TO CHECK FOR UNIQUE KEY
// // UPDATE WITH DB SPECIFIC CHECK

// async function isUniqueRecipient(username: string, key: Key): Promise<boolean | Error> {

//   try {
//     const doc = await store.read(username);
//     if (doc instanceof Error) return doc;

//     let status = true;

//     doc.recipient_keys.map((element) => {
//       if (element.key === key.key || element.id === key.id) status = false;
//     });

//     console.log({status})
//     return status;
//   }
//   catch (e) {
//     handleError({
//       code: 500,
//       message: "isUnique(key) error"
//     })
//   }
// }

// async function isUniqueProfile(username: string, key: Key): Promise<boolean | Error> {

//   try {
//     const doc = await store.read(username);
//     if (doc instanceof Error) return doc;

//     let status = true;

//     doc.profile_keys.map((element) => {
//       if (element.key === key.key || element.id === key.id) status = false;
//     });

//     console.log({status})
//     return status;
//   }
//   catch (e) {
//     handleError({
//       code: 500,
//       message: "isUnique(key) error"
//     })
//   }
// }

// async function isUniquePost(username: string, key: Key): Promise<boolean | Error> {

//   try {
//     const doc = await store.read(username);
//     if (doc instanceof Error) return doc;

//     let status = true;

//     doc.post_keys.map((element) => {
//       if (element.key === key.key || element.id === key.id ) status = false;
//     });
//     console.log({status})
//     return status;
//   }
//   catch (e) {
//     handleError({
//       code: 500,
//       message: "isUnique(key) error"
//     })
//   }
// }

