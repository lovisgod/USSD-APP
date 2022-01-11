"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _crypto = _interopRequireDefault(require("crypto"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const algorithm = 'aes-256-cbc';
var _default = {
  encrypt: stringToEncrypt => {
    if (!encryptedstring || typeof encryptedstring !== 'string') return;

    const iv = _crypto.default.randomBytes(16); // Generates a buffer


    const key = _crypto.default.randomBytes(32);

    const cipher = _crypto.default.createCipheriv(algorithm, Buffer.from(key), iv);

    let encrypted = cipher.update(stringToEncrypt);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return `${iv.toString('hex')}h${encrypted.toString('hex')}h${key.toString('hex')}`;
  },
  decrypt: encryptedstring => {
    if (!encryptedstring || typeof encryptedstring !== 'string') return;
    let [iv, encrypted, key] = encryptedstring.split('h');
    iv = Buffer.from(iv, 'hex');
    encrypted = Buffer.from(encrypted, 'hex');
    key = Buffer.from(key, 'hex');

    const decipher = _crypto.default.createDecipheriv(algorithm, key, iv);

    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
};
exports.default = _default;