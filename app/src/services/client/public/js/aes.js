const crypto = require("crypto");
const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16;


function encrypt(text, key_hex) {
  try {
    const key = Buffer.from(key_hex, "hex");
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(key), iv);

    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    const cipher_text =
      iv.toString("hex") + ":" + encrypted.toString("hex");
    return cipher_text;
  }
  catch (e) {
    console.error({ e })
    return null
  }
}

function decrypt(cipher_text, key_hex) {
  try {
    const key = Buffer.from(key_hex, "hex");
    const text_parts = cipher_text.split(":");
    const iv = Buffer.from(text_parts.shift(), "hex");

    const encrypted_text = Buffer.from(text_parts.join(":"), "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(key), iv);

    let plain_text = decipher.update(encrypted_text);
    plain_text = Buffer.concat([plain_text, decipher.final()]);
    return plain_text.toString();
  }
  catch (e) {
    console.error({ e })
    return null
  }

}

module.exports = {
  encrypt, decrypt
}