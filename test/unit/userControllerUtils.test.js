import { userPayloadFormat, getToken  } from "../../src/utils/userControllerUtils";
import { dbPayload,  userPayload } from "../utils/testValues";

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
});
