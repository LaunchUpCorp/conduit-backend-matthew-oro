import { validateBody, removeNull } from "../../src/utils/validators";

const expectedVal = {
  1: "string",
  2: "string number",
  3: "null number",
};

describe("Unit test functionality of validateBody()", () => {
  describe("Invalid Inputs", () => {
    describe("Object Key length doesn't match", () => {
      it("should return false", () => {
        const input = { food: "borger" };

        const valid = validateBody(input, expectedVal);

        expect(valid).toBe(false);
      });
    });
    describe("Types doesn't match - case 1", () => {
      it("should return false", () => {
        const input = {
          1: "fake",
          2: "forever",
          3: "food",
        };

        const valid = validateBody(input, expectedVal);

        expect(valid).toBe(false);
      });
    });
    describe("Types doesn't match - case 2", () => {
      it("should return false", () => {
        const input = {
          1: 2,
          2: "forever",
          3: null,
        };

        const valid = validateBody(input, expectedVal);

        expect(valid).toBe(false);
      });
    });
  });
  describe("Valid inputs", () => {
    it("should return true", () => {
      const input = {
        1: "keyboard",
        2: 1.46,
        3: null,
      };

      const valid = validateBody(input, expectedVal);

      expect(valid).toBe(true);
    });
  });
});
describe("Unit test of removeNull()", () => {
  describe("Given keys all null", () => {
    it("should return null", () => {
      const testValues = {
        something: null,
        test: null,
        food: null,
      };
      const test = removeNull(testValues);

      expect(test).toEqual(null);
    });
  });
  describe("Given keys has value", () => {
    it("should only return propeties with values", () => {
      const update = {
        email: null,
        username: "something",
        password: null,
        bio: "cool",
        image: null,
      };
      const test = removeNull(update);

      expect(test).toEqual({
        username: update.username,
        bio: update.bio,
      });
    });
  });
  describe("Given key properties with at least 1 key not valued null", () => {
    it("should return at least key value pair", () => {
      const update = {
        email: null,
        username: null,
        password: null,
        bio: "to test or not to test",
        image: null,
      };
      const test = removeNull(update);

      expect(test).toEqual({ bio: update.bio });
    });
  });
});
