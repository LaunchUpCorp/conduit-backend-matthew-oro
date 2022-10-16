import { createUser, queryOneUser } from "../../src/utils/userControllerUtils";
import { createUserInput, dbPayload, invalidLoginEmail } from "../utils/testValues";
import UserModel from "../../src/models/users";

describe("Integration tests for user controller utils", () => {
  afterAll(async () => {
    await UserModel.destroy({
      where: {
        email: createUserInput.user.email
      }
    })
  })
  describe("Test functionality of createUser()", () => {
    describe("Given all required values to create user", () => {
      it("should return database payload", async () => {
        const hash = dbPayload.hash;
        const user = await createUser({ ...createUserInput.user, hash });

        expect(user).toEqual(dbPayload);
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
        const user = await queryOneUser(createUserInput.user.email)

        expect(user).toEqual(dbPayload)
      })
    })
    describe("Given valid email that is not stored in the db", () => {
      it("should cause UserModel to throw error and return null ", async () => {
        const user = await queryOneUser(invalidLoginEmail.user.email)

        expect(UserModel).toThrow()
        expect(user).toBeNull()
      })
    })
  })
});
