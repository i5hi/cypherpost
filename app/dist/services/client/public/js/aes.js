var crypto = require("crypto");
function encrypt(text, key_hex) {
    var algorithm = "aes-256-cbc";
    var key = Buffer.from(key_hex, "hex");
    var IV_LENGTH = 16; // For AES, this is always 16
    var iv = crypto.randomBytes(IV_LENGTH);
    var cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
    var encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    var encrypted_text = iv.toString("hex") + ":" + encrypted.toString("base64");
    return encrypted_text;
}
function decrypt(cipher_text, key_hex) {
    var algorithm = "aes-256-cbc";
    var key = Buffer.from(key_hex, "hex");
    var IV_LENGTH = 16; // For AES, this is always 16
    var text_parts = cipher_text.split(":");
    var iv = Buffer.from(text_parts.shift(), "hex");
    var encrypted_text = Buffer.from(text_parts.join(":"), "base64");
    var decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);
    var decrypted = decipher.update(encrypted_text);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
module.exports = {
    encrypt: encrypt,
    decrypt: decrypt
};
//# sourceMappingURL=aes.js.map