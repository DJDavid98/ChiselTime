import { randomBytes, randomUUID } from 'node:crypto';

export const getRandomUuid = () => randomUUID();

export const getRandomString = (byteCount = 6) =>
  randomBytes(byteCount).toString('base64url').replace(/=+$/, '');

export const getRandomItem = <T>(array: [T, ...T[]]): T => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};
