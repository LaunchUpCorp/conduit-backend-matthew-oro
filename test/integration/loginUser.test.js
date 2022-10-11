import {
  invalidPayloadTest,
  registerUserTest,
  loginUserTest,
} from "../../src/utils/userTestUtils";
import { express, routes, app } from "../../src/utils/integrationTestSetup";
import { destroyUser } from "../../src/models/users";

app.use(express.json());

app.use("/api", routes);

describe("Integration tests for loging in user - POST API route for /api/users/login", () => {
  const registerTest = {
    user: {
      username: "cool",
      email: "cool@cool.cool",
      password: "1coolword",
    },
  };
  beforeAll(async () => await registerUserTest(registerTest));
  afterAll(async () => await destroyUser(registerTest.user.email));
  describe("Valid POST request", () => {
    const loginTest = {
      user: {
        email: registerTest.user.email,
        password: registerTest.user.password,
      },
    };
    it("POST /api/users/login - success - return status 201 and user object", async () =>
      await loginUserTest(loginTest));
  });
  describe("Invalid POST request", () => {
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
        endpoint: "/api/users/login",
        requestType: "POST",
        statusCode: 400,
        error: "Invalid payload format",
      };
      await invalidPayloadTest(testOptions);
    });
    it("Invalid email or password - case 1 (invalid email) - return status 403 and throw error", async () => {
      const test = {
        user: {
          email: "hot@cool.cool",
          password: registerTest.user.password,
        },
      };
      const testOptions = {
        testInfo: test,
        endpoint: "/api/users/login",
        requestType: "POST",
        statusCode: 403,
        error: "Invalid credentials",
      };
      await invalidPayloadTest(testOptions);
    });
    it("Invalid email or password - case 2 (invalid password) - return status 403 and throw error", async () => {
      const test = {
        user: {
          email: registerTest.user.email,
          password: "1hotword",
        },
      };
      const testOptions = {
        testInfo: test,
        endpoint: "/api/users/login",
        requestType: "POST",
        statusCode: 403,
        error: "Invalid credentials",
      };
      await invalidPayloadTest(testOptions);
    });
  });
});
