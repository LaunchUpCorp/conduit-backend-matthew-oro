import { validateBody } from "../../src/utils/validators";

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

        const valid = validateBody(input,expectedVal) 

        expect(valid).toBe(false)
      });
    });
    describe("Types doesn't match - case 1", () => {
      it("should return false", () => {
        const input = {
          1: "fake",
          2: "forever",
          3: "food",
        };

        const valid = validateBody(input,expectedVal) 

        expect(valid).toBe(false)
      });
    });
    describe("Types doesn't match - case 2", () => {
      it("should return false", () => {
        const input = {
          1: 2,
          2: "forever",
          3: null,
        };

        const valid = validateBody(input,expectedVal) 

        expect(valid).toBe(false)
      });
    });
  });
  describe("Valid inputs", () => {
    it("should return true", () => {
      const  input = {
        1: "keyboard",
        2: 1.46,
        3: null
      }

      const valid = validateBody(input, expectedVal)

      expect(valid).toBe(true)
    })
  })
});
