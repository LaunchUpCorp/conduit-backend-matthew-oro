import bcrypt from "bcrypt";

export async function generateHash(password) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

export async function verifyPassword(password, hash) {
  const match = await bcrypt.compare(password, hash);
  return match;
}
