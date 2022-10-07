import {
  express,
  request,
  routes,
  app,
} from "../../src/utils/integrationTestSetup";
import {
  registerUserTest,
  destroyColumn,
  getToken,
} from "../../src/utils/userTestUtils";

app.use(express.json());

app.use("/api", routes);

describe("Integration tests for user registration - GET API route for /api/users", () => {
  describe("Valid GET request", () => {
    const test = {
      user: {
        username: "cool",
        email: "cool@cool.cool",
        password: "1coolword",
      },
    };
    beforeEach(async () => await registerUserTest(test));
    afterEach(async () => await destroyColumn(test.user.email));
    it("GET /api/users - success - return status 200 and user object", async () => {
      const token = await getToken(test.user.email);
      const response = await request(app)
        .get("/api/users")
        .set("Authorization", token);
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        user: {
          email: expect.any(String),
          token: expect.any(String),
          username: expect.any(String),
          bio: expect.toBeOneOf([null, expect.any(String)]),
          image: expect.toBeOneOf([null, expect.any(String)]),
        },
      });
    });
  });
  describe("Invalid GET request", () => {
    it("Empty authorization header - return status 403 and throw error", async () => {
      const response = await request(app).get("/api/users");
      console.log(response.error.text)
      expect(response.statusCode).toBe(403);
      expect(response.error.text).toEqual("Authorization header empty");
    });
    it("Invalid jwt token  - return status 403 and throw error", async () => {
      const response = await request(app).get("/api/users").set("Authorization", "Bearer polarbear");
      expect(response.statusCode).toBe(403);
      expect(response.error.text).toEqual("Invalid jwt token");
    });
  });
});
