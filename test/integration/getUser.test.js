import {
  createExpiredToken,
  getTestToken,
  getUserTest,
  invalidPayloadTest,
  invalidTokenTest,
} from "../../src/utils/userTestUtils";
import { express, routes, app } from "../../src/utils/integrationTestSetup";
import { destroyUser } from "../../src/models/users";

app.use(express.json());

app.use("/api", routes);

describe("Integration tests for requesting current user data - GET API route for /api/users", () => {
  describe("Valid GET request", () => {
    const userTest = {
      user: {
        username: "cool",
        email: "cool@cool.cool",
        password: "1coolword",
      },
    };
    beforeAll(async () => (userTest.user.token = await getTestToken(userTest)));
    afterAll(async () => await destroyUser(userTest.user.email));
    it("GET /api/users - success - return status 201 and user object", async () =>
      await getUserTest(userTest));
  });
  describe("Invalid GET request", () => {
    const expiredTest = {
      user: {
        username: "phone",
        email: "phone@phone.phone",
        password: "1phoneword",
      },
    };
    beforeAll(
      async () => (expiredTest.token = await createExpiredToken(expiredTest))
    );
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
    it("Invalid jwt token  - return status 403, throw error, and redirect", async () => {
      const testOptions = {
        header: "Bearer polarbear",
        endpoint: "/api/users",
        requestType: "GET",
        statusCode: 403,
        error: "jwt malformed",
        redirect: "/",
      };
      await invalidTokenTest(testOptions);
    });
    it.only("Expired jwt token  - return status 403, throw error, and redirect", async () => {
      const testOptions = {
        header: `Bearer ${expiredTest.token}`,
        endpoint: "/api/users",
        requestType: "GET",
        statusCode: 403,
        error: "jwt expired",
        redirect: "/",
      };
      await invalidTokenTest(testOptions);
    });
  });
});
