import emptyEndpointResponse from "../../src/utils/index.js";

// example jest unit test
describe("empty endpoint", () => {
  it("should return a message", () => {
    const response = emptyEndpointResponse();
    expect(response.status).toEqual("API is running on /api");
  });
});
