import {
  express,
  routes,
  app,
} from "../../src/utils/integrationTestSetup";
import {
  invalidPayloadTest,
  registerUserTest,
} from "../../src/utils/userTestUtils";
import { destroyUser } from "../../src/models/users";

app.use(express.json());

app.use("/api", routes);

describe("Integration tests for user registration - POST API route for /api/users", () => {
  describe("Valid POST request", () => {
    const test = {
      user: {
        username: "tester",
        email: "test@test.test",
        password: "1testword",
      },
    };
    afterEach(async () => await destroyUser(test.user.email));
    it("POST /api/users - success - return status 201 and user object", async () =>
      await registerUserTest(test));
  });
  describe("Invalid POST request", () => {
    it("Empty payload - return status 400 and throw error", async () => {
      const test = {};
      const testOptions = {
        testInfo: test,
        endpoint: "/api/users",
        requestType: "POST",
        statusCode: 400,
        error: "No payload found"
      };
      await invalidPayloadTest(testOptions);
    });
    it("Invalid payload format - return status 400 and throw error", async () => {
      const test = {
        user: {
          fake: "faker",
          chef: "ramsay",
          id: 4,
        },
      };
      const testOptions = {
        testInfo: test,
        endpoint: "/api/users",
        requestType: "POST",
        statusCode: 400,
        error: "Invalid payload format"
      };
      await invalidPayloadTest(testOptions);
    });
    it("Invalid email format - return status 400 and throw error", async () => {
      const test = {
        user: {
          username: "bobby",
          email: "bob",
          password: "1bobword",
        },
      };
      const testOptions = {
        testInfo: test,
        endpoint: "/api/users",
        requestType: "POST",
        statusCode: 400,
        error: "Invalid email format"
      };
      await invalidPayloadTest(testOptions);
    });
  });
});
