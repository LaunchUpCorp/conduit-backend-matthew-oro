import {
  express,
  request,
  routes,
  app,
} from "../../src/utils/integrationTestSetup";
import { registerUserTest, destroyColumn } from "../../src/utils/userTestUtils";

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
    afterEach(async () => await destroyColumn(test.user.email));
    it("POST /api/users - success - return status 201 and user object", async () =>
      await registerUserTest(test));
  });
  describe("Invalid POST request", () => {
    it("Empty payload - return status 400 and throw error", async () => {
      const response = await request(app).post("/api/users");
      expect(response.statusCode).toBe(400);
      expect(response.error.text).toEqual("No payload found");
    });
    it("Invalid payload format - return status 400 and throw error", async () => {
      const test = {
        user: {
          fake: "faker",
          chef: "ramsay",
          id: 4,
        },
      };
      const response = await request(app).post("/api/users").send(test);
      expect(response.statusCode).toBe(400);
      expect(response.error.text).toEqual("Invalid payload format");
    });
    it("Invalid email format - return status 400 and throw error", async () => {
      const test = {
        user: {
          username: "bobby",
          email: "bob",
          password: "1bobword",
        },
      };
      const response = await request(app).post("/api/users").send(test);
      expect(response.statusCode).toBe(400);
      expect(response.error.text).toEqual("Invalid email format");
    });
  });
});
