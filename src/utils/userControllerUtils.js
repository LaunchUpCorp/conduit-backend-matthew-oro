import { Promise } from "sequelize";
import UserModel from "../models/users";
import { generateHash } from "../utils/bcryptUtils";

export async function destroyUser(email) {
  await UserModel.destroy({ where: { email: email } });
}

export async function createUser(user) {
  const { password, ...insert } = user;
  insert.hash = await generateHash(user.password);
  const newUser = await UserModel.create(insert);
  return newUser;
}

export async function queryOneUser(email) {
  try {
    const user = await UserModel.findOne({ where: { email: email } }).get();
    return user;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export function userPayloadFormat(payload) {
  return {
    user: {
      email: payload.email,
      token: payload.token,
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
