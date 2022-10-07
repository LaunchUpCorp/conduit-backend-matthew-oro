import { validateBody } from "../../src/utils/validators";

describe("invalid input using validateBody(reqBody,expectedObj)", () => {
  const expectedObj = {
    obj1: "string",
    obj2: "string",
    obj3: "number",
  };
  it("extra property - should return false", () => {
    const testObj = {
      obj1: "test1",
      obj2: "test2",
      obj3: 4,
      obj4: "extra",
    };
    const response = validateBody(testObj, expectedObj);
    expect(response).toEqual(false);
  });
  it("less properties than expectedObj - should return false", () => {
    const testObj = {
      obj1: "test1",
    };
    const response = validateBody(testObj, expectedObj);
    expect(response).toEqual(false);
  });
  it("wrong property name(s) - should return false", () => {
    const testObj = {
      video: "youtube",
      obj2: "something",
      length: 5,
    };
    const response = validateBody(testObj, expectedObj);
    expect(response).toEqual(false);
  });
  it("wrong typing - should return false", () => {
    const testObj = {
      obj1: 4,
      obj2: null,
      obj3: "test",
    };
    const response = validateBody(testObj, expectedObj);
    expect(response).toEqual(false);
  });
});
describe("valid input using validateBody(reqBody,expectedObj) - return true  ", () => {
  it("correct values - should return true", () => {
    const expectedObj = {
      id: "number",
      food: "string",
      cost: "number",
      chef: "string null",
    };
    const testObj = {
      id: 24,
      food: "pizza",
      cost: 5,
      chef: null,
    };
    const response = validateBody(testObj, expectedObj);
    expect(response).toEqual(true);
  });
});
