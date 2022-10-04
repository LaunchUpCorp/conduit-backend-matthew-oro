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
    if (!user) {
      res.status(400).send("Invalid request payload");
      throw new Error("Invalid request payload");
    }
    if (!validateBody(user, expectedPayload)) {
      res.status(400).send("Invalid request payload");
      throw new Error("Invalid request payload");
    }

    const token = jwt.sign(user, process.env.PRIVATE_KEY, {
      algorithm: 'RS256'
    });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);

    const newUser = await UserModel.create({
      token: token,
      username: user.username,
      email: user.email,
      hash: hash,
    });

    await newUser.save();

    const returnData = {
      user: {
        email: newUser.email,
        token: newUser.token,
        username: newUser.username,
        bio: newUser.bio,
        image: newUser.image,
      },
    };
    return res.status(201).send(returnData);
  } catch (e) {
    console.error(e);
    throw new Error("Errors found on users controller");
  }
}
