import { validateBody, validateEmail } from "../utils/validators";
import { userResponse } from "../utils/userControllerUtils";
import { createUser, queryOneUser } from "../models/users";
import { signToken } from "../utils/jwtUtils";
import { errorHandles } from "../utils/errorHandleUtils";
import { verifyPassword } from "../utils/bcryptUtils";

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
    const newUser = await createUser(user);
    const token = signToken(newUser);
    const responseData = userResponse(newUser, token);
    return res.status(201).json(responseData);
  } catch (e) {
    console.error(e);
    const error = errorHandles.find(({ message }) => message === e.message);
    if (!error) return res.status(500).send("Server Error");
    res.status(error.statusCode).send(error.message);
  }
}

export async function getUser(req, res) {
  try {
    const user = await queryOneUser(req.user.email);
    const responseData = userResponse(user);
    return res.status(200).json(responseData);
  } catch (e) {
    console.error(e);
    const error = errorHandles.find(({ message }) => message === e.message);
    if (!error) return res.status(500).send("Server Error");
    res.status(error.statusCode).send(error.message);
  }
}

export async function loginUser(req, res) {
  try {
    const { user } = req.body;
    const expectedPayload = {
      email: "string",
      password: "string",
    };
    if (!user) {
      throw new Error("No payload found");
    }
    if (!validateBody(user, expectedPayload)) {
      throw new Error("Invalid payload format");
    }
    const foundUser = await queryOneUser(user.email);
    if (!foundUser || !verifyPassword(user, foundUser)) {
      throw new Error("Invalid credentials");
    }
    const token = signToken(foundUser);
    const responseData = userResponse(foundUser, token);
    res.status(200).send(responseData);
  } catch (e) {
    console.error(e);
    const error = errorHandles.find(({ message }) => message === e.message);
    if (!error) return res.status(500).send("Server Error");
    res.status(error.statusCode).send(error.message);
  }
}
