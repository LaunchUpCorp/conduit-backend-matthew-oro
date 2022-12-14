import FollowModel from "../models/follows";

export async function followProfile(userEmail, followingUserEmail) {
  try {
    await FollowModel.create({
      userId: userEmail,
      followingId: followingUserEmail,
    });
    return true;
  } catch (e) {
    console.error(e);
    if (e.name === "SequelizeUniqueContraintError") {
      throw new Error("Payload value(s) not unique");
    }
    return null;
  }
}

export async function unfollowProfile(userEmail, unfollowUserEmail) {
  try {
    const destroy = await FollowModel.destroy({
      where: {
        userId: userEmail,
        followingId: unfollowUserEmail,
      },
    });
    if (destroy === 0) {
      throw new Error("No rows destroyed");
    }
    return false;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function isFollowing(userEmail, profileEmail) {
  const check = await FollowModel.findOne({
    where: {
      userId: userEmail,
      followingId: profileEmail,
    },
  });
  return !!check;
}
export function profilePayloadFormat(followingUser, isFollowing) {
  return {
    profile: {
      username: followingUser.username,
      bio: followingUser.bio,
      image: followingUser.image,
      following: isFollowing,
    },
  };
}
