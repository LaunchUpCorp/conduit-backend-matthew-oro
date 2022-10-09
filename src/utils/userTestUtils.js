import { request, app } from "../../src/utils/integrationTestSetup";

export async function registerUserTest(testInfo) {
  const response = await request(app).post("/api/users").send(testInfo);
  await expect(response.statusCode).toBe(201);
  await expect(response.body).toMatchObject({
    user: {
      email: expect.any(String),
      token: expect.any(String),
      username: expect.any(String),
      bio: expect.toBeOneOf([null, expect.any(String)]),
      image: expect.toBeOneOf([null, expect.any(String)]),
    },
  });
}

