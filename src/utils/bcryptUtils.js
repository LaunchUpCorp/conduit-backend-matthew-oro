import bcrypt from "bcrypt";

export async function generateHash(password = null) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (e) {
    return null;
  }
}

export async function verifyPassword(requestUser, dbUser) {
  try {
    if (!requestUser || !dbUser) {
      throw new Error("empty parameters");
    }
    const match = await bcrypt.compare(requestUser.password, dbUser.hash);
    return match;
  } catch (e) {
    console.error(e);
    return false;
  }
}
