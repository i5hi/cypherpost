const crypto = require("crypto");

function encrypt(text, key_hex){
  const algorithm = "aes-256-cbc";
  const key = Buffer.from(key_hex, "hex");
  const IV_LENGTH = 16; // For AES, this is always 16
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);

  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  const encrypted_text =
    iv.toString("hex") + ":" + encrypted.toString("base64");

  return encrypted_text;
}

function decrypt(cipher_text, key_hex){

    const algorithm = "aes-256-cbc";
    const key = Buffer.from(key_hex, "hex");
  
    const IV_LENGTH = 16; // For AES, this is always 16
    const text_parts = cipher_text.split(":");
    const iv = Buffer.from(text_parts.shift(), "hex");
    const encrypted_text = Buffer.from(text_parts.join(":"), "base64");
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);
  
    let decrypted = decipher.update(encrypted_text);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
  
    return decrypted.toString();

}

module.exports={
  encrypt,decrypt
}