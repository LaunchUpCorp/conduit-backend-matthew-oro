import UserModel from "../../src/models/users";
import { request, app } from "../../src/utils/integrationTestSetup";

export async function destroyColumn(email) {
  await UserModel.destroy({ where: { email: email } });
}

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

export async function getToken(email) {
  const user = await UserModel.findByPk(email);
  return user.getDataValue("token");
}
