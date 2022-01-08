import crypto from 'crypto';

const algorithm = 'aes-256-cbc';

export default {
  encrypt: (stringToEncrypt) => {
    if (!encryptedstring || typeof encryptedstring !== 'string') return;

    const iv = crypto.randomBytes(16); // Generates a buffer
    const key = crypto.randomBytes(32);

    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(stringToEncrypt);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return `${iv.toString('hex')}h${encrypted.toString('hex')}h${key.toString('hex')}`;
  },

  decrypt: (encryptedstring) => {
    if (!encryptedstring || typeof encryptedstring !== 'string') return;

    let [iv, encrypted, key] = encryptedstring.split('h');
    iv = Buffer.from(iv, 'hex');
    encrypted = Buffer.from(encrypted, 'hex');
    key = Buffer.from(key, 'hex');

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted);

    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
};
