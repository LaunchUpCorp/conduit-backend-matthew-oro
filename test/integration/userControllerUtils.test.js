import {
  createUser,
  queryOneUser,
  queryOneUserAndUpdate,
} from "../../src/utils/userControllerUtils";
import {
  createUserInput,
  dbPayload,
  invalidLoginEmail,
  updateUserInput,
} from "../utils/testValues";
import UserModel from "../../src/models/users";

describe("Integration tests for user controller utils", () => {
  beforeAll(async () => {
    const create = {
      email: "test@test.test",
      username: "tester",
      hash: "(Salt)y(Hash)browns",
    };
    await createUser(create);
  });
  afterAll(async () => {
    await UserModel.destroy({
      where: { email: "test@test.test" },
    });
  });
  afterAll(async () => {
    await UserModel.destroy({
      where: {
        email: createUserInput.user.email,
      },
    });
  });
  describe("Test functionality of createUser()", () => {
    describe("Given all required values to create user", () => {
      it("should return database payload", async () => {
        const hash = dbPayload.hash;
        const user = await createUser({ ...createUserInput.user, hash });

        expect(user).toEqual(dbPayload);
      });
    });
    describe("Given required values but email and/or username is not unique", () => {
      it("should throw error", async () => {
        try {
          const hash = dbPayload.hash;
          const user = await createUser({ ...createUserInput.user, hash });

          expect(user).toThrow();
        } catch (e) {
          expect(e.message).toEqual("Payload value(s) not unique");
        }
      });
    });
    describe("Given missing required values to create user", () => {
      it("should cause UserModel to throw and return null", async () => {
        // did not include hash for create user
        const user = await createUser(createUserInput);

        expect(UserModel).toThrow();
        expect(user).toBeNull();
      });
    });
  });
  describe("Test functionality of queryOneUser()", () => {
    describe("Given valid email that is already stored in the db", () => {
      it("should return corresponding email db payload", async () => {
        const user = await queryOneUser(createUserInput.user.email);

        expect(user).toEqual(dbPayload);
      });
    });
    describe("Given valid email that is not stored in the db", () => {
      it("should cause UserModel to throw error and return null ", async () => {
        const user = await queryOneUser(invalidLoginEmail.user.email);

        expect(UserModel).toThrow();
        expect(user).toBeNull();
      });
    });
  });
  describe("Test functionality of queryOneUserAndUpdate()", () => {
    describe("Given valid email that is already stored in the db", () => {
      it("should return updated db payload", async () => {
        const user = await queryOneUserAndUpdate(createUserInput.user.email, {
          bio: updateUserInput.user.bio,
        });

        expect(user).toEqual({ ...dbPayload, bio: updateUserInput.user.bio });
      });
    });
    describe("Given valid email to query that is not stored in the db", () => {
      it("should cause UserModel to throw error and return null ", async () => {
        const user = await queryOneUserAndUpdate(invalidLoginEmail.user.email, {
          bio: updateUserInput.user.bio,
        });

        expect(UserModel).toThrow();
        expect(user).toBeNull();
      });
    });
    describe("Given valid email and/or username that is not unique to update", () => {
      it("should cause UserModel and queryOneUserAndUpdate to throw error ", async () => {
        try {
          const user = await queryOneUserAndUpdate(createUserInput.user.email, {
            username: "tester",
          });

          expect(UserModel).toThrow();
          expect(user).toThrow();
        } catch (e) {
          expect(e.message).toEqual("Payload value(s) not unique");
        }
      });
    });
    describe("Given null as update value", () => {
      it("should cause UserModel to throw error and return null ", async () => {
        const user = await queryOneUserAndUpdate(
          invalidLoginEmail.user.email,
          null
        );

        expect(UserModel).toThrow();
        expect(user).toBeNull();
      });
    });
  });
});
