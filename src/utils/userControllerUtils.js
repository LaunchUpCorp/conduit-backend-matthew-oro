import UserModel from "../models/users";
import { generateHash } from "../utils/bcryptUtils";
import { signToken } from "./jwtUtils";

export async function destroyUser(email) {
  await UserModel.destroy({ where: { email: email } });
}

export async function createUser(user) {
  const { password, ...insert } = user;
  const token = signToken(insert);
  insert.hash = await generateHash(user.password);
  const newUser = await UserModel.create(insert);
  const newUserPayload = {
    user: {
      email: newUser.email,
      token: token,
      username: newUser.username,
      bio: newUser.bio,
      image: newUser.image,
    },
  };
  return newUserPayload;
}

export async function queryOneUser(email) {
  try {
    const user = await UserModel.findOne({ where: { email: email } }).get();
    const userPayload = {
      user: {
        email: user.email,
        token: token,
        username: user.username,
        bio: user.bio,
        image: user.image,
      },
    };
    return userPayload;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export function getToken(header) {
  const token = header.split(" ").pop();
  return token;
}
