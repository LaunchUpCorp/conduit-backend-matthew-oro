import {
  getTestToken,
  getUserTest,
  invalidPayloadTest,
  invalidTokenTest,
} from "../../src/utils/userTestUtils";
import {
  express,
  routes,
  app,
} from "../../src/utils/integrationTestSetup";
import { destroyUser } from "../../src/models/users";

app.use(express.json());

app.use("/api", routes);

describe("Integration tests for requesting current user data - GET API route for /api/users", () => {
  describe("Valid GET request", () => {
    const test = {
      user: {
        username: "cool",
        email: "cool@cool.cool",
        password: "1coolword",
      },
    };
    beforeEach(async () => test.user.token = await getTestToken(test));
    afterEach(async () => await destroyUser(test.user.email));
    it("GET /api/users - success - return status 201 and user object", async () =>
      await getUserTest(test));
  });
  describe("Invalid GET request", () => {
    it("Empty authorization header - return status 403 and throw error", async () => {
      const testOptions = {
        testInfo: test,
        endpoint: "/api/users",
        requestType: "GET",
        statusCode: 403,
        error: "Authorization header empty",
      };
      await invalidPayloadTest(testOptions);
    });
    it("Invalid jwt token  - return status 403 and throw error", async () => {
      const testOptions = {
        header: "Bearer polarbear",
        endpoint: "/api/users",
        requestType: "GET",
        statusCode: 403,
        error: "Invalid jwt token",
      };
      await invalidTokenTest(testOptions);
    });
  });
});
