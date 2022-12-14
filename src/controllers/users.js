import { removeNull, validateBody, validateEmail } from "../utils/validators";
import {
  createUser,
  updateUserInputFormat,
  queryOneUser,
  queryOneUserAndUpdate,
  userPayloadFormat,
} from "../utils/userControllerUtils";
import { signToken } from "../utils/jwtUtils";
import { errorHandles } from "../utils/errorHandleUtils";
import { verifyPassword } from "../utils/bcryptUtils";
import { generateHash } from "../utils/bcryptUtils";

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

    const hash = await generateHash(user.password);

    const newUser = await createUser({ ...user, hash });

    const token = signToken(user, "1w");

    const userPayload = userPayloadFormat({ ...newUser, token });

    return res.status(201).json(userPayload);
  } catch (e) {
    console.error(e);

    const error = errorHandles.find(({ message }) => message === e.message);

    if (!error) return res.status(500).send("Server Error");

    return res.status(error.statusCode).send(error.message);
  }
}

export async function getUser(req, res) {
  const user = await queryOneUser({ email: req.user.email });

  const token = signToken(user, "1w");

  const userPayload = userPayloadFormat({ ...user, token });

  return res.json(userPayload);
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

    const foundUser = await queryOneUser({ email: user.email });

    const match = await verifyPassword(user, foundUser);

    if (!foundUser || !match) {
      throw new Error("Invalid credentials");
    }

    const token = signToken(foundUser, "1w");

    const userPayload = userPayloadFormat({ ...foundUser, token });

    res.status(200).json(userPayload);
  } catch (e) {
    console.error(e);

    const error = errorHandles.find(({ message }) => message === e.message);

    if (!error) return res.status(500).send("Server Error");

    return res.status(error.statusCode).send(error.message);
  }
}

export async function updateUser(req, res) {
  try {
    const { user } = req.body;
    if (!user) {
      throw new Error("No payload found");
    }
    const formatPayload = {
      username: user.username || null,
      password: user.password || null,
      bio: user.bio || null,
      image: user.image || null,
    };
    const formattedUser = removeNull(formatPayload);
    if (!formattedUser) {
      throw new Error("Invalid payload format");
    }

    const updatedUser = await queryOneUserAndUpdate(
      req.user.email,
      formattedUser
    );

    const token = signToken(updatedUser, "1w");

    const userPayload = userPayloadFormat({ ...updatedUser, token });

    res.status(200).json(userPayload);
  } catch (e) {
    console.error(e);

    const error = errorHandles.find(({ message }) => message === e.message);

    if (!error) return res.status(500).send("Server Error");

    return res.status(error.statusCode).send(error.message);
  }
}
