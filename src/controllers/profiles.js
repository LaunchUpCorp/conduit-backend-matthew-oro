import { queryOneUser } from "../utils/userControllerUtils";
import {
  profilePayloadFormat,
  followProfile,
  unfollowProfile,
} from "../utils/profileControllerUtils";
import { errorHandles } from "../utils/errorHandleUtils";

export async function handleFollowProfile(req, res) {
  try {
    if (req.user.username === req.params.username) {
      throw new Error("query and current user cannot be the same");
    }
    const currentUser = req.user;
    const followingUser = await queryOneUser({ username: req.params.username });
    if (!followingUser) { throw new Error("user query does not exist");
    }
    const isFollowing = await followProfile(
      currentUser.email,
      followingUser.email
    );

    const profilePayload = profilePayloadFormat(followingUser, isFollowing);

    res.status(201).json(profilePayload);
  } catch (e) {
    console.error(e);

    const error = errorHandles.find(({ message }) => message === e.message);

    if (!error) return res.status(500).send("Server Error");

    return res.status(error.statusCode).send(error.message);
  }
}

export async function handleUnfollowProfile(req, res) {
  try {
    if (req.user.username === req.params.username) {
      throw new Error("query and current user cannot be the same");
    }
    const currentUser = req.user;
    const followingUser = await queryOneUser({
      username: req.params.username,
    });

    if (!followingUser) {
      throw new Error("user query does not exist");
    }

    const isFollowing = await unfollowProfile(
      currentUser.email,
      followingUser.email
    );

    const profilePayload = profilePayloadFormat(followingUser, isFollowing);

    res.status(200).json(profilePayload);
  } catch (e) {
    console.error(e);

    const error = errorHandles.find(({ message }) => message === e.message);

    if (!error) return res.status(500).send("Server Error");

    return res.status(error.statusCode).send(error.message);
  }
}
