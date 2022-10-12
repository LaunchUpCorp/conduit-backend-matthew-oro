import { userResponse, getToken } from "../../src/utils/userControllerUtils";

describe("input tests on userResponse function", () => {
  it("passed payload - return expected user object", () => {
    const testObj = {
      time: 49,
      email: "good@good.good",
      bio: "Im not cool",
      image: null,
      birthday: null,
      food: "mango",
      username: "icecream"
    };
    const token = "ticket";
    const response = userResponse(testObj, token);
    expect(response).toMatchObject({
      user: {
        email: expect.any(String),
        username: expect.any(String),
        bio: expect.toBeOneOf([null, expect.any(String)]),
        image: expect.toBeOneOf([null, expect.any(String)]),
      },
    });
  });
});
describe("unit test on getToken function", () => {
  it("get value after white space", () => {
    const expected = "SentToken"
    const test = `Bearer ${expected}`
    const response = getToken(test)
    expect(response).toEqual(expected)
  })
})
