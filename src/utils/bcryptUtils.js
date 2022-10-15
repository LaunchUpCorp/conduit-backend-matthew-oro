import bcrypt from "bcrypt";

export async function generateHash(password) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

export async function verifyPassword(requestUser, dbUser) {
  if (!requestUser || !dbUser) return false;
  const match = await bcrypt.compare(requestUser.password, dbUser.hash);
  return match;
}
