import { request, app } from "../../src/utils/integrationTestSetup";

export async function registerUserTest(testInfo) {
  try {
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
  } catch (e) {
    console.error(e);
  }
}

export async function invalidPayloadTest({
  testInfo,
  endpoint,
  requestType,
  statusCode,
  error,
}) {
  try {
    switch (requestType.toUpperCase()) {
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
  } catch (e) {
    console.error(e);
  }
}

export async function getTestToken(testInfo) {
  try {
    const response = await request(app).post("/api/users").send(testInfo);
    return response.body.user.token;
  } catch (e) {
    console.error(e);
  }
}
export async function getUserTest({ user }) {
  try {
    const { token } = user;
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
  } catch (e) {
    console.error(e);
  }
}
export async function invalidTokenTest({
  header,
  endpoint,
  requestType,
  payload,
  statusCode,
  error,
  redirect,
}) {
  try {
    switch (requestType.toUpperCase()) {
      case "GET": {
        const response = await request(app)
          .get(endpoint)
          .set("Authorization", header);
        expect(response.statusCode).toBe(statusCode);
        expect(response.headers.location).toContain(redirect);
      }
      case "POST":
        {
          const response = await request(app)
            .post(endpoint)
            .set("Authorization", header)
            .send(payload);
          expect(response.statusCode).toBe(statusCode);
          expect(response.error.text).toEqual(error);
          expect(response.headers.location).toContain(redirect);
        }
        break;
      case "PUT":
        {
          const response = await request(app)
            .put(endpoint)
            .set("Authorization", header)
            .send(payload);
          expect(response.statusCode).toBe(statusCode);
          expect(response.error.text).toEqual(error);
          expect(response.headers.location).toContain(redirect);
        }
        break;
      case "DELETE": {
        const response = await request(app)
          .delete(endpoint)
          .set("Authorization", header)
          .send(payload);
        expect(response.statusCode).toBe(statusCode);
        expect(response.error.text).toEqual(error);
        expect(response.headers.location).toContain(redirect);
      }
      default:
        throw new Error("Invalid request type for this test");
    }
  } catch (e) {
    console.error(e);
  }
}
export async function lognUserTest(testInfo) {
  try {
    const response = await request(app).post("/api/users/login").send(testInfo);
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
  } catch (e) {
    console.error(e);
  }
}
