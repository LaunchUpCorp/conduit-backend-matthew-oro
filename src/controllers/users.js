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
    if (!validateBody(user, expectedPayload)) {
      throw new Error("Invalid payload format");
    }
    if (!validateEmail(user.email)) {
      throw new Error("Invalid email format");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);

    const newUser = await UserModel.create({
      username: user.username,
      email: user.email,
      hash: hash,
    });
    const token = signToken(newUser.get());
    newUser.setDataValue("token", token);
    await newUser.save();
    const responseData = userResponse(newUser.get());
    return res.status(201).json(responseData);
  } catch (e) {
    console.error(e);
    if (e.message === "No payload found")
      return res.status(400).send(e.message);
    if (e.message === "Invalid payload format")
      return res.status(400).send(e.message);
    if (e.message === "Invalid email format")
      return res.status(400).send(e.message);
    return res.status(500).send("Server error");
  }
}

export async function getUser(req, res) {
  try {
    if (!req.get("Authorization")) {
      throw new Error("Authorization header empty");
    }
    const token = req.get("Authorization").split(" ")[1];

    const decode = jwt.verify(token, process.env.PUBLIC_KEY, { algorithms: 'RS256' })

    const user = await UserModel.findOne({ where: { email: decode.email } })

    const responseData = userResponse(user.get())

    return res.send(200).json(responseData)

  } catch (e) {
    console.error(e);
    if (e.message === "Authorization header empty") return res.status(403).send(e.message);
    if (e.name === "JsonWebTokenError") return res.status(403).send(e.message)
    return res.status(500).send("Server error")

  }
}

export function signToken(payload) {
  const { token, createdAt, updatedAt, ...newPayload } = payload;
  return jwt.sign(newPayload, process.env.PRIVATE_KEY, { algorithm: "RS256" });
}

export function userResponse(payload) {
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
