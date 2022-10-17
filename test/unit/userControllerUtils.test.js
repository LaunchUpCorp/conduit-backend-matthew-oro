import { userPayloadFormat, getToken, updateUserInputFormat } from "../../src/utils/userControllerUtils";
import { dbPayload, invalidCreateUserInput, userPayload } from "../utils/testValues";

describe("Unit test of userPayloadFormat()", () => {
  describe("Given database object and token to format", () => {
    it("should return formatted user payload response", () => {
      const token = "jwt.token";
      const test = userPayloadFormat({ ...dbPayload, token });

      expect(test).toEqual(userPayload);
    });
  });
});
describe("Unit test of getToken()", () => {
  describe("Given string with 2 words with white space", () => {
    it("should return the respective second word", () => {
      const test = getToken("Bearer token");

      expect(test).toEqual("token");
    });
  });
  describe("Unit test of updateUserInputFormat()", () => {
    describe("Given keys not related to user properties", () => {
      it("should return null", () => {
        const test = updateUserInputFormat(invalidCreateUserInput);

        expect(test).toEqual(null);
      });
    });
    describe("Given keys related to user properties and all values are null", () => {
      it("should return null", () => {
        const update = {
          email: null,
          username: null,
          password: null,
          bio: null,
          image: null
        }
        const test = updateUserInputFormat(update);

        expect(test).toEqual(null);
      });
    });
    describe("Given keys related to user properties with at least 1 key not valued null", () => {
      it("should return null", () => {
        const update = {
          email: null,
          username: null,
          password: null,
          bio: "to test or not to test",
          image: null
        }
        const test = updateUserInputFormat(update);

        expect(test).toEqual({ bio: update.bio });
      });
    });
  });
});
