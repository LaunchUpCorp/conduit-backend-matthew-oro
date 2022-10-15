import { createUserInput, dbPayload, invalidLoginEmail, invalidLoginPassword, userLoginInput } from "../utils/testValues";
import bcrypt from 'bcrypt'
import { generateHash, verifyPassword } from "../../src/utils/bcryptUtils"

describe("Integration tests for user bcrypt utils", () => {
  describe("Test functionality of generateHash()", () => {
    describe("Given password as string", () => {
      it("should return a hashed password", async () => {
        const hash = await generateHash(createUserInput.user.password)

        expect(hash).toEqual(expect.any(String));
      });
    });
    describe("No parameters provided", () => {
      it("should cause bcrypt to throw and return null", async () => {
        const hash = await generateHash();

        expect(bcrypt.compareSync).toThrow();
        expect(hash).toBeNull();
      });
    });
  });
  describe("Test functionality of verifyPassword()", () => {
    describe("Given hash and password that matches to compare", () => {
      it("should return true", async () => {
        const match = await verifyPassword(userLoginInput.user, dbPayload)

        expect(match).toBe(true)
      })
    })
    describe("Given hash and password as string value that don't match to compare", () => {
      it("should return false ", async () => {
        const match = await verifyPassword(invalidLoginPassword.user, dbPayload)

        expect(match).toBe(false)
      })
    })
    describe("Given only password to parameter", () => {
      it("should cause bcrypt to throw error and return false ", async () => {
        const match = await verifyPassword(userLoginInput.user)

        expect(bcrypt.compareSync).toThrow()
        expect(match).toBe(false)
      })
    })
  })
});
