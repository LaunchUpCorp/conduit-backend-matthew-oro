import UserModel from "../models/users";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validateBody, validateEmail } from "../utils/validators";

export async function registerUser(req, res) {
  try {
    const { user } = req.body;
    const expectedPayload = {
      username: "string",
      email: "string",
      password: "string",
    };
    if (!user) {
      res.status(400).send("No payload found");
      throw new Error("Invalid request payload, no payload found");
    }
    else if (!validateBody(user, expectedPayload)) {
      res.status(400).send("Invalid payload format, refer the documents for payload format")
      throw new Error("Invalid payload format")
    }
    else if (!validateEmail(user.email)) {
      res.status(400).send("Invalid email format")
      throw new Error("Invalid email format")
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);

    const newUser = await UserModel.create({
      username: user.username,
      email: user.email,
      hash: hash,
    });
    const token = signToken(newUser)
    newUser.setDataValue('token', token)
    await newUser.save()
    return res.status(201).send(userResponse(newUser));
  } catch (e) {
    console.error(e);
    throw new Error("Errors found on user registerUser controller");
  }
}

function signToken(payload) {
  const { token, createdAt, updatedAt, ...newPayload } = payload
  return jwt.sign(newPayload, process.env.PRIVATE_KEY, { algorithm: 'RS256' })
}

function userResponse(payload) {
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
