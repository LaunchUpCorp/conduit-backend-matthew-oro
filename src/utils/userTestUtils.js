import { request, app } from "./integrationTestSetup";
import jwt from "jsonwebtoken";

export async function registerUserTest(testInfo) {
  const response = await request(app).post("/api/users").send(testInfo);
  await expect(response.statusCode).toBe(201);
  await expect(response.body).toMatchObject({
    user: {
      email: expect.any(String),
      username: expect.any(String),
      bio: expect.toBeOneOf([null, expect.any(String)]),
      image: expect.toBeOneOf([null, expect.any(String)]),
    },
  });
}

export async function invalidPayloadTest({
  testInfo,
  endpoint,
  requestType,
  statusCode,
  error,
}) {
  switch (requestType.toUpperCase()) {
    case "GET":
      {
        const response = await request(app).get(endpoint);
        expect(response.statusCode).toBe(statusCode);
        expect(response.error.text).toEqual(error);
      }
      break;
    case "POST":
      {
        const response = await request(app).post(endpoint).send(testInfo);
        expect(response.statusCode).toBe(statusCode);
        expect(response.error.text).toEqual(error);
      }
      break;
    case "PUT":
      {
        const response = await request(app).put(endpoint).send(testInfo);
        expect(response.statusCode).toBe(statusCode);
        expect(response.error.text).toEqual(error);
      }
      break;
    case "DELETE": {
      const response = await request(app).delete(endpoint).send(testInfo);
      expect(response.statusCode).toBe(statusCode);
      expect(response.error.text).toEqual(error);
    }
    default:
      throw new Error("Invalid request type for this test");
  }
}

export async function getTestToken(testInfo) {
  const response = await request(app).post("/api/users").send(testInfo);
  return response.body.user.token;
}
export async function getUserTest({ user }) {
  const { token } = user;
  const response = await request(app)
    .get("/api/users")
    .set("Authorization", token);
  expect(response.statusCode).toBe(200);
  expect(response.body).toMatchObject({
    user: {
      email: expect.any(String),
      username: expect.any(String),
      bio: expect.toBeOneOf([null, expect.any(String)]),
      image: expect.toBeOneOf([null, expect.any(String)]),
    },
  });
}
export async function invalidTokenTest({
  header,
  endpoint,
  requestType,
  payload,
  statusCode,
  redirect,
}) {
  switch (requestType.toUpperCase()) {
    case "GET": {
      const response = await request(app)
        .get(endpoint)
        .set("Authorization", header);
      console.log(response.error.status)
      expect(response.error.status).toBe(statusCode);
      expect(response.headers.location).toContain(redirect);
    }
    break;
    case "POST":
      {
        const response = await request(app)
          .post(endpoint)
          .set("Authorization", header)
          .send(payload);
        expect(response.error.status).toBe(statusCode);
        expect(response.headers.location).toContain(redirect);
      }
      break;
    case "PUT":
      {
        const response = await request(app)
          .put(endpoint)
          .set("Authorization", header)
          .send(payload);
        expect(response.error.status).toBe(statusCode);
        expect(response.headers.location).toContain(redirect);
      }
      break;
    case "DELETE": {
      const response = await request(app)
        .delete(endpoint)
        .set("Authorization", header)
        .send(payload);
      expect(response.error.status).toBe(statusCode);
      expect(response.headers.location).toContain(redirect);
    }
    default:
      throw new Error("Invalid request type for this test");
  }
}
export async function loginUserTest(testInfo) {
  const response = await request(app).post("/api/users/login").send(testInfo);
  expect(response.statusCode).toBe(200);
  expect(response.body).toMatchObject({
    user: {
      email: expect.any(String),
      username: expect.any(String),
      bio: expect.toBeOneOf([null, expect.any(String)]),
      image: expect.toBeOneOf([null, expect.any(String)]),
    },
  });
}
export async function createExpiredToken({ user }) {
  const { password, ...jwtPayload } = user;
  const token = jwt.sign(jwtPayload, process.env.PRIVATE_KEY, {
    algorithm: "RS256",
    expiresIn: "-1h",
  });
  return token;
}
