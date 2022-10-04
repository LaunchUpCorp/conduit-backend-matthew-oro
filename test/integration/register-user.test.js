const express = require("express");
const request = require("supertest");
import routes from "../../src/routes/index";
import UserModel from '../../src/models/users'
const app = express();

app.use(express.json());

app.use("/api", routes);

describe("Integration tests for user registration - POST API route for /api/users", () => {
  const testInfo = {
    user: {
      username: "Jacob",
      email: "jake@jake.jake",
      password: "jakejake",
    },
  };
  it("POST /api/users - success - return status 201 and user object", async () => {
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
    await UserModel.destroy({
      where: {
        email: "jake@jake.jake"
      }
    })
  });
});
