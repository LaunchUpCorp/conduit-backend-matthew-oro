import {express, request, routes, app} from '../../src/utils/integrationTestSetup'
import UserModel from '../../src/models/users'

app.use(express.json());

app.use("/api", routes);

export async function registerUserTest() {
  const testInfo = {
    user: {
      username: "Jacob",
      email: "jake@jake.jake",
      password: "jakejake",
    },
  };
  const response = await request(app).post("/api/users").send(testInfo);
  await expect(response.statusCode).toBe(201);
  await expect(response.body).toMatchObject({
    user: {
      email: expect.any(String),
      token: expect.any(String),
      username: expect.any(String),
      bio: expect.toBeOneOf([null, expect.any(String)]),
      image: expect.toBeOneOf([null, expect.any(String)])
    }
  })
}

describe("Integration tests for user registration - POST API route for /api/users", () => {
  afterEach(async () => {
    await UserModel.destroy({
      where: {
        email: "jake@jake.jake"
      }
    })
  })
  it("POST /api/users - success - return status 201 and user object", registerUserTest)
});
