import {
  createCipheriv,
  randomBytes,
  scryptSync,
  createDecipheriv,
} from 'crypto';

const key = scryptSync(
  process.env.ENCRYPTION_PASS,
  process.env.ENCRYPTION_SALT,
  32,
) as Buffer;

export const encryptData = async (data: string) => {
  const iv = randomBytes(16);
  const cipher = createCipheriv(process.env.ENCRYPTION_ALGORITHM, key, iv);

  return {
    data: Buffer.concat([cipher.update(data), cipher.final()]).toString('hex'),
    iv: iv.toJSON(),
  };
};

export const decryptData = async (data: any, iv: Buffer) => {
  const decipher = createDecipheriv(process.env.ENCRYPTION_ALGORITHM, key, iv);

  return Buffer.concat([
    decipher.update(data, 'hex'),
    decipher.final(),
  ]).toString('utf8');
};
