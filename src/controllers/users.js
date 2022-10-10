import { validateBody, validateEmail } from "../utils/validators";
import { userResponse, getToken } from "../utils/userControllerUtils";
import { createUser, queryOneUser } from "../models/users"
import { verifyToken, signToken } from "../utils/jwtUtils"

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
    const {password, ...tokenPayload} = user
    const token = signToken(tokenPayload)
    const newUser = await createUser(user)
    const responseData = userResponse(newUser,token);
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
    const token = getToken(req.get("Authorization")) 
    const decode = verifyToken(token) 
    const user = queryOneUser(decode.email);
    const responseData = userResponse(user);
    return res.status(200).json(responseData);
  } catch (e) {
    console.error(e);
    if (e.message === "Authorization header empty")
      return res.status(403).send(e.message);
    if (e.name === "JsonWebTokenError")
      return res.status(403).send("Invalid jwt token");
    return res.status(500).send("Server error");
  }
}

