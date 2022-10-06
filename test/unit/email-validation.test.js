
import { validateEmail } from "../../src/utils/validators";

describe("invalid email inputs", () => {
  it("input email without '@' or domain '.com'", () => {
    const email = "name"
    const response = validateEmail(email)
    expect(response).toEqual(false)
  })
  it("input email with '@' but without domain '.com'", () => {
    const email = "name@gmail"
    const response = validateEmail(email)
    expect(response).toEqual(false)
  })
  it("input email without '@' but with domain '.com'", () => {
    const email = "name.com"
    const response = validateEmail(email)
    expect(response).toEqual(false)
  })
})
describe("valid email input", () => {
  it("input gmail email exapmple account", () => {
    const email = "name@gmail.com"
    const response = validateEmail(email)
    expect(response).toEqual(true)
  })
})
