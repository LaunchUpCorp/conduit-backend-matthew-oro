import { validateEmail } from "../../src/utils/validators";

describe("Unit test functionality of validateEmail()", () => {
  describe("Invalid email inputs", () => {
    describe("Input without host (@gmail) or domain (.com)", () => {
      it("should return false", () => {
        const valid = validateEmail("myEmail")

        expect(valid).toBe(false)
      })
    })
    describe("Input with host (@gmail) but without domain (.com)", () => {
      it("should return false", () => {
        const valid = validateEmail("myEmail@gmail")

        expect(valid).toBe(false)
      })
    })
    describe("Input without host (@gmail) but with domain (.com)", () => {
      it("should return false", () => {
        const valid = validateEmail("myEmail.com")

        expect(valid).toBe(false)
      })
    })
  })
  describe("Valid email input", () => {
    it("should return true", () => {
      const valid = validateEmail("myEmail@gmail.com")

      expect(valid).toBe(true)
    })
  })
})
