import UserModel from "../models/users";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validateBody } from "../utils/index";

export async function registerUser(req, res) {
  try {
    const { user } = req.body;
    const expectedPayload = {
      username: "string",
      email: "string",
      password: "string",
    };
    if (!user || !validateBody(user,expectedPayload)) {
      res.status(400).send("Invalid request payload");
      throw new Error("Invalid request payload");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);

    const newUser = await UserModel.create({
      username: user.username,
      email: user.email,
      hash: hash,
    });
    const token = signToken(newUser) 
    newUser.setDataValue('token',token)
    return res.status(201).send(userResponse(newUser));
  } catch (e) {
    console.error(e);
    throw new Error("Errors found on user registerUser controller");
  }
}

function signToken(payload){
  const {token,createdAt,updatedAt, ...newPayload } = payload
  return jwt.sign(newPayload, process.env.PRIVATE_KEY, {algorithm: 'RS256'})
}

function userResponse(payload){
  return {
    user: {
      email: payload.getDataValue('email'),
      token: payload.getDataValue('token'),
      username: payload.getDataValue('username'),
      bio: payload.getDataValue('bio'),
      image: payload.getDataValue('image'),
    }
  }
}
