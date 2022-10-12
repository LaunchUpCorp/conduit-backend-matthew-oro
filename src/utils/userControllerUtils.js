import UserModel from "../models/users";
import { generateHash } from "../utils/bcryptUtils";

export async function destroyUser(email) {
  await UserModel.destroy({ where: { email: email } });
}

export async function createUser(user) {
  const { password, ...insert } = user;
  insert.hash = await generateHash(user.password);
  const newUser = await UserModel.create(insert);
  return newUser.get();
}

export async function queryOneUser(email) {
  const user = await UserModel.findOne({ where: { email: email } });
  if (!user) {
    return null;
  }
  return user.get();
}

export function userResponse(payload, token) {
  return {
    user: {
      email: payload.email,
      token: token,
      username: payload.username,
      bio: payload.bio,
      image: payload.image,
    },
  };
}

export function getToken(header) {
  const token = header.split(" ").pop();
  return token;
}
