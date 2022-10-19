import { createUser } from "../../src/utils/userControllerUtils";
import {
  followProfile,
  unfollowProfile,
  isFollowing
} from "../../src/utils/profileControllerUtils";
import UserModel from "../../src/models/users";

const user = {
  email: "user@user.user",
  username: "follower",
  hash: "(Salt)y(Hash)browns",
};
const createFollowing = {
  email: "follw@follow.follow",
  username: "following",
  hash: "(Salt)y(Hash)browns",
};
describe("Integration tests for profile controller utils", () => {
  beforeAll(async () => {
    await createUser(createFollowing);
    await createUser(user);
  });
  afterAll(async () => {
    await UserModel.destroy({
      where: {
        email: user.email
      }
    });
    await UserModel.destroy({
      where: {
        email: createFollowing.email
      }
    });
  });
  describe("Test functionality of followProfile()", () => {
    describe("Given query user exists to follow user", () => {
      it("should return true", async () => {
        const isFollowing = await followProfile(
          user.email,
          createFollowing.email
        );

        expect(isFollowing).toBe(true);
      });
    });
    describe("Given query user is not unique", () => {
      it("should cause FollowModel to throw error", async () => {
        try {
          await followProfile(user.email, createFollowing.email);
        } catch (e) {
          expect(e.message).toEqual("SequelizeUniqueConstraintError");
        }
      });
    });
    describe("Given query user doesnt exist", () => {
      it("should return null", async () => {
        const isFollowing = await followProfile(user.email, "wont@work.okay");

        expect(isFollowing).toBeNull();
      });
    });
  });

  describe("Test functionality of unfollowProfile()", () => {
    describe("Given query user exists to unfollow user", () => {
      it("should return false", async () => {
        const isFollowing = await unfollowProfile(
          user.email,
          createFollowing.email
        );

        expect(isFollowing).toBe(false);
      });
    });
    describe("Given query user is not unique", () => {
      it("should throw error", async () => {
        try {
          await unfollowProfile(createUser.email, createFollowing.email);
        } catch (e) {
          expect(followProfile).toThrow();
          expect(e.message).toEqual("Payload value(s) not unique");
        }
      });
    });
    describe("Given query user doesnt exist", () => {
      it("should return null", async () => {
        const isFollowing = await unfollowProfile(user.email,
          "wont@work.atAll",
        );

        expect(isFollowing).toBeNull();
      });
    });
  });

  // TODO: create test user/profile for this test
  describe("Test functionality of isFollowing()", () => {
    beforeAll(async () => await followProfile(user.email, createFollowing.email))
    describe("Given current user follows query user", () => {
      it("should return true", async () => {
        const isFollowingProfile = await isFollowing(
          user.email,
          createFollowing.email
        );

        expect(isFollowingProfile).toBe(true);
      });
    });
    describe("Given current user does not follow query user", () => {
      beforeAll(async () => await unfollowProfile(user.email, createFollowing.email))
      it("should return false", async () => {
        const isFollowingProfile = await isFollowing(
          user.email,
          createFollowing.email
        );

        expect(isFollowingProfile).toBe(false);
      });
    });
  });
});
