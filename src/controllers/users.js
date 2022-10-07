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
      throw new Error("No payload found");
    }
    else if (!validateBody(user, expectedPayload)) {
      throw new Error("Invalid payload format")
    }
    else if (!validateEmail(user.email)) {
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
    const responseData = userResponse(newUser)
    return res.status(201).json(responseData);
  } catch (e) {
    console.error(e);
    if (e === "No payload found") return res.status(400).send("No payload found")
    if (e === "Invalid payload format") return res.status(400).send("Invalid payload format, refer to docs for payload format")
    if (e === "Invalid email format") return res.status(400).send("Invalid email format")
    return res.status(500).send("Server error")
  }
}

export function signToken(payload) {
  const { token, createdAt, updatedAt, ...newPayload } = payload.get()
  return jwt.sign(newPayload, process.env.PRIVATE_KEY, { algorithm: 'RS256' })
}

export function userResponse(payload) {
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
