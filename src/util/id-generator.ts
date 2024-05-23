import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUV0123456789");

export const generateId = (size = 8) => {
  return nanoid(size);
};
