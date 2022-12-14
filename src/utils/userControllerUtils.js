import UserModel from "../models/users";

export async function createUser(user) {
  try {
    const newUser = await UserModel.create({
      email: user.email,
      username: user.username,
      hash: user.hash,
    });
    const { createdAt, updatedAt, ...newUserPayload } = newUser.get();
    return newUserPayload;
  } catch (e) {
    console.error(e);
    if (e.name === "SequelizeUniqueConstraintError") {
      throw new Error("Payload value(s) not unique");
    }
    return null;
  }
}

export async function queryOneUser(payload) {
  try {
    const user = await UserModel.findOne({ where: payload });
    const { createdAt, updatedAt, ...userPayload } = user.get();
    return userPayload;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function queryOneUserAndUpdate(email, payload) {
  try {
    let user = await UserModel.findOne({ where: { email: email } });
    user.set(payload);
    await user.save();
    const { createdAt, updatedAt, ...userPayload } = user.get();
    return userPayload;
  } catch (e) {
    console.error(e);
    if (e.name === "SequelizeUniqueConstraintError") {
      throw new Error("Payload value(s) not unique");
    }
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
