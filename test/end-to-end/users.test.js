import supertest from "supertest";
import createServer from "../../src/utils/serverSetup";
import * as userControllerUtils from "../../src/utils/userControllerUtils";
import * as bcryptUtils from "../../src/utils/bcryptUtils";
import { deserializeUser } from "../../src/middleware/deserializeUser";
import * as jwtUtils from "../../src/utils/jwtUtils";

import {
  userPayload,
  createUserInput,
  invalidCreateUserInput,
  userLoginInput,
  dbPayload,
  invalidLoginPassword,
  invalidLoginEmail,
  verifyTokenPayload,
  updateUserInput,
} from "../utils/testValues";

const app = createServer();

// Registration tests
describe("test user routes", () => {
  describe("POST /api/users - user registration", () => {
    describe("Given request payload is valid", () => {
      it("should return status 201 and user payload", async () => {
        const generateHashMock = jest
          .spyOn(bcryptUtils, "generateHash")
          .mockReturnValueOnce(dbPayload.hash);

        const createUserMock = jest
          .spyOn(userControllerUtils, "createUser")
          .mockReturnValueOnce(dbPayload);

        const jwtSignTokenMock = jest
          .spyOn(jwtUtils, "signToken")
          .mockReturnValueOnce("token string");

        const { body, statusCode } = await supertest(app)
          .post("/api/users")
          .send(createUserInput);

        expect(statusCode).toBe(201);

        expect(body).toEqual(userPayload);

        expect(generateHashMock).toHaveBeenCalledWith(
          createUserInput.user.password
        );

        expect(createUserMock).toHaveBeenCalledWith({
          ...createUserInput.user,
          hash: dbPayload.hash,
        });

        expect(jwtSignTokenMock).toHaveBeenCalledWith(
          createUserInput.user,
          "1w"
        );
      });
    });
    describe("Request payload not given", () => {
      it("should return status 400", async () => {
        const createUserMock = jest.spyOn(userControllerUtils, "createUser");

        const jwtSignTokenMock = jest.spyOn(jwtUtils, "signToken");

        const { statusCode } = await supertest(app).post("/api/users");

        expect(statusCode).toBe(400);

        expect(createUserMock).not.toHaveBeenCalled();

        expect(jwtSignTokenMock).not.toHaveBeenCalled();
      });
    });
    describe("Given request payload is invalid", () => {
      it("should return status 400", async () => {
        const createUserMock = jest.spyOn(userControllerUtils, "createUser");

        const jwtSignTokenMock = jest.spyOn(jwtUtils, "signToken");

        const { statusCode } = await supertest(app)
          .post("/api/users")
          .send(invalidCreateUserInput);

        expect(statusCode).toBe(400);

        expect(createUserMock).not.toHaveBeenCalled();

        expect(jwtSignTokenMock).not.toHaveBeenCalled();
      });
    });
    describe("Given request payload is valid but email and/or username is not unqiue", () => {
      it("should return status 422", async () => {
        const createUserMock = jest
          .spyOn(userControllerUtils, "createUser")
          .mockRejectedValueOnce(new Error("Payload value(s) not unique"));

        const jwtSignTokenMock = jest.spyOn(jwtUtils, "signToken");

        const { statusCode } = await supertest(app)
          .post("/api/users")
          .send(createUserInput);

        expect(statusCode).toBe(422);

        expect(createUserMock).toHaveBeenCalledWith({
          ...createUserInput.user,
          hash: expect.any(String),
        });

        expect(jwtSignTokenMock).not.toHaveBeenCalled();
      });
    });
    describe("Given valid payload with invalid email format", () => {
      it("should return status 400", async () => {
        const invalidEmail = {
          user: { ...createUserInput.user, email: "faker" },
        };

        const createUserMock = jest.spyOn(userControllerUtils, "createUser");

        const jwtSignTokenMock = jest.spyOn(jwtUtils, "signToken");

        const { statusCode } = await supertest(app)
          .post("/api/users")
          .send(invalidEmail);

        expect(statusCode).toBe(400);

        expect(createUserMock).not.toHaveBeenCalled();

        expect(jwtSignTokenMock).not.toHaveBeenCalled();
      });
    });
  });

  // Login tests
  describe("POST /api/users/login - user login", () => {
    describe("given credentials is valid", () => {
      it("should return status 200 and user payload", async () => {
        const queryUserMock = jest
          .spyOn(userControllerUtils, "queryOneUser")
          .mockReturnValueOnce(dbPayload);

        const verifyPasswordMock = jest
          .spyOn(bcryptUtils, "verifyPassword")
          .mockReturnValueOnce(true);

        const signTokenMock = jest
          .spyOn(jwtUtils, "signToken")
          .mockReturnValueOnce("token string");

        const { body, statusCode } = await supertest(app)
          .post("/api/users/login")
          .send(userLoginInput);

        expect(statusCode).toBe(200);

        expect(queryUserMock).toHaveBeenCalledWith(userLoginInput.user.email);

        expect(verifyPasswordMock).toHaveBeenCalledWith(
          userLoginInput.user,
          dbPayload
        );

        expect(signTokenMock).toHaveBeenCalledWith(dbPayload, "1w");

        expect(body).toEqual(userPayload);
      });
    });
    describe("Request payload not given", () => {
      it("should return status 400", async () => {
        const queryUserMock = jest.spyOn(userControllerUtils, "queryOneUser");

        const verifyPasswordMock = jest.spyOn(bcryptUtils, "verifyPassword");

        const signTokenMock = jest.spyOn(jwtUtils, "signToken");

        const { statusCode } = await supertest(app).post("/api/users/login");

        expect(statusCode).toBe(400);

        expect(queryUserMock).not.toHaveBeenCalled();

        expect(verifyPasswordMock).not.toHaveBeenCalled();

        expect(signTokenMock).not.toHaveBeenCalled();
      });
    });
    describe("Given request payload is invalid", () => {
      it("should return status 400", async () => {
        const queryUserMock = jest.spyOn(userControllerUtils, "queryOneUser");

        const verifyPasswordMock = jest.spyOn(bcryptUtils, "verifyPassword");

        const signTokenMock = jest.spyOn(jwtUtils, "signToken");

        const { statusCode } = await supertest(app)
          .post("/api/users/login")
          .send(invalidCreateUserInput);

        expect(statusCode).toBe(400);

        expect(queryUserMock).not.toHaveBeenCalled();

        expect(verifyPasswordMock).not.toHaveBeenCalled();

        expect(signTokenMock).not.toHaveBeenCalled();
      });
    });
    describe("given credentials is invalid - case 1 - valid email, invalid password", () => {
      it("should return status 401", async () => {
        const queryUserMock = jest
          .spyOn(userControllerUtils, "queryOneUser")
          .mockReturnValueOnce(dbPayload);

        const verifyPasswordMock = jest
          .spyOn(bcryptUtils, "verifyPassword")
          .mockReturnValueOnce(false);

        const signTokenMock = jest.spyOn(jwtUtils, "signToken");

        const { statusCode } = await supertest(app)
          .post("/api/users/login")
          .send(invalidLoginPassword);

        expect(statusCode).toBe(401);

        expect(queryUserMock).toHaveBeenCalledWith(
          invalidLoginPassword.user.email
        );

        expect(verifyPasswordMock).toHaveBeenCalledWith(
          invalidLoginPassword.user,
          dbPayload
        );

        expect(signTokenMock).not.toHaveBeenCalled();
      });
    });
    describe("given credentials is invalid - case 2 - invalid email, (in)valid password", () => {
      it("should return status 401", async () => {
        const queryUserMock = jest
          .spyOn(userControllerUtils, "queryOneUser")
          .mockReturnValueOnce(null);

        const verifyPasswordMock = jest.spyOn(bcryptUtils, "verifyPassword");

        const signTokenMock = jest.spyOn(jwtUtils, "signToken");

        const { statusCode } = await supertest(app)
          .post("/api/users/login")
          .send(invalidLoginEmail);

        expect(statusCode).toBe(401);

        expect(queryUserMock).toHaveBeenCalledWith(
          invalidLoginEmail.user.email
        );

        expect(verifyPasswordMock).toHaveBeenCalledWith(
          invalidLoginEmail.user,
          null
        );

        expect(signTokenMock).not.toHaveBeenCalled();
      });
    });
  });

  // GET current user data test
  describe("GET /api/users - get current user", () => {
    describe("given user authentication is valid", () => {
      let token = "";
      beforeAll(() => (token = jwtUtils.signToken(dbPayload, "1m")));
      it("should return status 200 and user payload", async () => {
        const mockReq = {
          get: jest.fn(() => `Bearer ${token}`),
        };
        const mockRes = {};
        const mockNext = jest.fn();

        const verifyTokenMock = jest
          .spyOn(jwtUtils, "verifyToken")
          .mockReturnValueOnce(verifyTokenPayload);

        const queryUserMock = jest
          .spyOn(userControllerUtils, "queryOneUser")
          .mockReturnValueOnce(dbPayload);

        const { body, statusCode } = await supertest(app)
          .get("/api/users")
          .set("Authorization", `Bearer ${token}`);

        await deserializeUser(mockReq, mockRes, mockNext);

        expect(statusCode).toBe(200);

        expect(body).toEqual(userPayload);

        // middleware tests
        expect(mockReq.get).toHaveBeenCalledWith(`Authorization`);
        expect(mockReq).toEqual({ ...mockReq, user: verifyTokenPayload });
        expect(mockNext).toHaveBeenCalled();
        //end of middleware tests

        expect(verifyTokenMock).toHaveBeenCalledWith(token);

        expect(queryUserMock).toHaveBeenCalledWith(verifyTokenPayload.email);
      });
    });
    describe("Authorization header not provided", () => {
      it("should return 403 and redirect to '/'", async () => {
        const mockReq = {
          get: jest.fn(() => null),
        };
        const mockRes = {
          redirect: jest.fn(),
        };
        const mockNext = jest.fn();

        const verifyTokenMock = jest.spyOn(jwtUtils, "verifyToken");

        const queryUserMock = jest.spyOn(userControllerUtils, "queryOneUser");

        const response = await supertest(app).get("/api/users");

        await deserializeUser(mockReq, mockRes, mockNext);

        expect(response.statusCode).toBe(403);
        expect(response.headers.location).toEqual("/");

        // middleware tests
        expect(mockReq.get).toHaveBeenCalledWith(`Authorization`);
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockRes.redirect).toHaveBeenCalled();
        //end of middleware tests

        expect(verifyTokenMock).not.toHaveBeenCalled();

        expect(queryUserMock).not.toHaveBeenCalled();
      });
    });
    describe("given invalid jwt token payload format", () => {
      it("should return 403 and redirect to '/'", async () => {
        const mockReq = {
          get: jest.fn(() => "Bearer fake.token"),
        };
        const mockRes = {
          redirect: jest.fn(),
        };
        const mockNext = jest.fn();

        const verifyTokenMock = jest.spyOn(jwtUtils, "verifyToken");

        const queryUserMock = jest.spyOn(userControllerUtils, "queryOneUser");

        const response = await supertest(app)
          .get("/api/users")
          .set("Authorization", "Bearer fake.token");

        await deserializeUser(mockReq, mockRes, mockNext);

        expect(response.statusCode).toBe(403);
        expect(response.headers.location).toEqual("/");

        // middleware tests
        expect(mockReq.get).toHaveBeenCalledWith("Authorization");
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockRes.redirect).toHaveBeenCalled();
        //end of middleware tests

        expect(verifyTokenMock).toThrow();

        expect(queryUserMock).not.toHaveBeenCalled();
      });
    });
    describe("given expired jwt token", () => {
      let token = "";
      beforeAll(() => (token = jwtUtils.signToken(dbPayload, "-1h")));
      it("should return 403 and redirect to '/'", async () => {
        const mockReq = {
          get: jest.fn(() => `Bearer ${token}`),
        };
        const mockRes = {
          redirect: jest.fn(),
        };
        const mockNext = jest.fn();

        const verifyTokenMock = jest.spyOn(jwtUtils, "verifyToken");

        const queryUserMock = jest.spyOn(userControllerUtils, "queryOneUser");

        const response = await supertest(app)
          .get("/api/users")
          .set("Authorization", `Bearer ${token}`);

        await deserializeUser(mockReq, mockRes, mockNext);

        expect(response.statusCode).toBe(403);
        expect(response.headers.location).toEqual("/");

        // middleware tests
        expect(mockReq.get).toHaveBeenCalledWith("Authorization");
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockRes.redirect).toHaveBeenCalled();
        //end of middleware tests

        expect(verifyTokenMock).toThrow();

        expect(queryUserMock).not.toHaveBeenCalled();
      });
    });
  });

  // PUT current user
  describe("PUT /api/users - update current user", () => {
    describe("given user payload and authentication is valid", () => {
      let token = "";
      beforeAll(() => (token = jwtUtils.signToken(dbPayload, "1m")));
      it("should return status 200 and user payload", async () => {
        const mockReq = {
          get: jest.fn(() => `Bearer ${token}`),
        };
        const mockRes = {};
        const mockNext = jest.fn();

        const verifyTokenMock = jest
          .spyOn(jwtUtils, "verifyToken")
          .mockReturnValueOnce(verifyTokenPayload);

        const queryUserAndUpdateMock = jest
          .spyOn(userControllerUtils, "queryOneUserAndUpdate")
          .mockReturnValueOnce({ ...dbPayload, bio: updateUserInput.user.bio });

        // TODO: create put request payload template
        const { body, statusCode } = await supertest(app)
          .put("/api/users")
          .set("Authorization", `Bearer ${token}`)
          .send(updateUserInput);

        await deserializeUser(mockReq, mockRes, mockNext);

        expect(statusCode).toBe(200);

        expect(body).toEqual({
          user: { ...userPayload.user, bio: updateUserInput.user.bio },
        });

        // middleware tests
        expect(mockReq.get).toHaveBeenCalledWith(`Authorization`);
        expect(mockReq).toEqual({ ...mockReq, user: verifyTokenPayload });
        expect(mockNext).toHaveBeenCalled();
        //end of middleware tests

        expect(verifyTokenMock).toHaveBeenCalledWith(token);

        expect(queryUserAndUpdateMock).toHaveBeenCalledWith(
          verifyTokenPayload.email,
          { bio: updateUserInput.user.bio }
        );
      });
    });
    describe("given user payload the username value is not unique and authentication is valid", () => {
      let token = "";
      beforeAll(() => (token = jwtUtils.signToken(dbPayload, "1m")));
      it("should return status 422", async () => {
        const mockReq = {
          get: jest.fn(() => `Bearer ${token}`),
        };
        const mockRes = {};
        const mockNext = jest.fn();

        const verifyTokenMock = jest
          .spyOn(jwtUtils, "verifyToken")
          .mockReturnValueOnce(verifyTokenPayload);

        const queryUserAndUpdateMock = jest
          .spyOn(userControllerUtils, "queryOneUserAndUpdate")
          .mockRejectedValueOnce(new Error("Payload value(s) not unique"));

        const { statusCode, body } = await supertest(app)
          .put("/api/users")
          .set("Authorization", `Bearer ${token}`)
          .send({ user: { username: "takenUsername" } });

        await deserializeUser(mockReq, mockRes, mockNext);

        console.log(body);
        expect(statusCode).toBe(422);

        // middleware tests
        expect(mockReq.get).toHaveBeenCalledWith(`Authorization`);
        expect(mockReq).toEqual({ ...mockReq, user: verifyTokenPayload });
        expect(mockNext).toHaveBeenCalled();
        //end of middleware tests

        expect(verifyTokenMock).toHaveBeenCalledWith(token);

        expect(queryUserAndUpdateMock).toHaveBeenCalledWith(
          verifyTokenPayload.email,
          { username: expect.any(String) }
        );
      });
    });
    describe("given user payload is empty and authentication is valid", () => {
      let token = "";
      beforeAll(() => (token = jwtUtils.signToken(dbPayload, "1m")));
      it("should return status 400", async () => {
        const mockReq = {
          get: jest.fn(() => `Bearer ${token}`),
        };
        const mockRes = {};
        const mockNext = jest.fn();

        const verifyTokenMock = jest
          .spyOn(jwtUtils, "verifyToken")
          .mockReturnValueOnce(verifyTokenPayload);

        const queryUserAndUpdateMock = jest.spyOn(
          userControllerUtils,
          "queryOneUserAndUpdate"
        );

        const { statusCode } = await supertest(app)
          .put("/api/users")
          .set("Authorization", `Bearer ${token}`);

        await deserializeUser(mockReq, mockRes, mockNext);

        expect(statusCode).toBe(400);

        // middleware tests
        expect(mockReq.get).toHaveBeenCalledWith(`Authorization`);
        expect(mockReq).toEqual({ ...mockReq, user: verifyTokenPayload });
        expect(mockNext).toHaveBeenCalled();
        //end of middleware tests

        expect(verifyTokenMock).toHaveBeenCalledWith(token);

        expect(queryUserAndUpdateMock).not.toHaveBeenCalled();
      });
    });
    describe("given user payload key values are all null and authentication is valid", () => {
      let token = "";
      beforeAll(() => (token = jwtUtils.signToken(dbPayload, "1m")));
      it("should return status 400", async () => {
        const mockReq = {
          get: jest.fn(() => `Bearer ${token}`),
        };
        const mockRes = {};
        const mockNext = jest.fn();

        const verifyTokenMock = jest
          .spyOn(jwtUtils, "verifyToken")
          .mockReturnValueOnce(verifyTokenPayload);

        const queryUserAndUpdateMock = jest.spyOn(
          userControllerUtils,
          "queryOneUserAndUpdate"
        );

        // TODO: add put request payload
        const { statusCode } = await supertest(app)
          .put("/api/users")
          .set("Authorization", `Bearer ${token}`)
          .send({ user: { ...updateUserInput.user, bio: null } });

        await deserializeUser(mockReq, mockRes, mockNext);

        expect(statusCode).toBe(400);

        // middleware tests
        expect(mockReq.get).toHaveBeenCalledWith(`Authorization`);
        expect(mockReq).toEqual({ ...mockReq, user: verifyTokenPayload });
        expect(mockNext).toHaveBeenCalled();
        //end of middleware tests

        expect(verifyTokenMock).toHaveBeenCalledWith(token);

        expect(queryUserAndUpdateMock).not.toHaveBeenCalled();
      });
    });
    describe("Authorization header not provided", () => {
      it("should return 403 and redirect to '/'", async () => {
        const mockReq = {
          get: jest.fn(() => null),
        };
        const mockRes = {
          redirect: jest.fn(),
        };
        const mockNext = jest.fn();

        const verifyTokenMock = jest.spyOn(jwtUtils, "verifyToken");

        const queryUserAndUpdateMock = jest.spyOn(
          userControllerUtils,
          "queryOneUserAndUpdate"
        );

        const response = await supertest(app).put("/api/users");

        await deserializeUser(mockReq, mockRes, mockNext);

        expect(response.statusCode).toBe(403);
        expect(response.headers.location).toEqual("/");

        // middleware tests
        expect(mockReq.get).toHaveBeenCalledWith(`Authorization`);
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockRes.redirect).toHaveBeenCalled();
        //end of middleware tests

        expect(verifyTokenMock).not.toHaveBeenCalled();

        expect(queryUserAndUpdateMock).not.toHaveBeenCalled();
      });
    });
    describe("given invalid jwt token payload format", () => {
      it("should return 403 and redirect to '/'", async () => {
        const mockReq = {
          get: jest.fn(() => "Bearer fake.token"),
        };
        const mockRes = {
          redirect: jest.fn(),
        };
        const mockNext = jest.fn();

        const verifyTokenMock = jest.spyOn(jwtUtils, "verifyToken");

        const queryUserAndUpdateMock = jest.spyOn(
          userControllerUtils,
          "queryOneUserAndUpdate"
        );

        const response = await supertest(app)
          .put("/api/users")
          .set("Authorization", "Bearer fake.token");

        await deserializeUser(mockReq, mockRes, mockNext);

        expect(response.statusCode).toBe(403);
        expect(response.headers.location).toEqual("/");

        // middleware tests
        expect(mockReq.get).toHaveBeenCalledWith("Authorization");
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockRes.redirect).toHaveBeenCalled();
        //end of middleware tests

        expect(verifyTokenMock).toThrow();

        expect(queryUserAndUpdateMock).not.toHaveBeenCalled();
      });
    });
    describe("given expired jwt token", () => {
      let token = "";
      beforeAll(() => (token = jwtUtils.signToken(dbPayload, "-1h")));
      it("should return 403 and redirect to '/'", async () => {
        const mockReq = {
          get: jest.fn(() => `Bearer ${token}`),
        };
        const mockRes = {
          redirect: jest.fn(),
        };
        const mockNext = jest.fn();

        const verifyTokenMock = jest.spyOn(jwtUtils, "verifyToken");

        const queryUserAndUpdateMock = jest.spyOn(
          userControllerUtils,
          "queryOneUserAndUpdate"
        );

        const response = await supertest(app)
          .put("/api/users")
          .set("Authorization", `Bearer ${token}`);

        await deserializeUser(mockReq, mockRes, mockNext);

        expect(response.statusCode).toBe(403);
        expect(response.headers.location).toEqual("/");

        // middleware tests
        expect(mockReq.get).toHaveBeenCalledWith("Authorization");
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockRes.redirect).toHaveBeenCalled();
        //end of middleware tests

        expect(verifyTokenMock).toThrow();

        expect(queryUserAndUpdateMock).not.toHaveBeenCalled();
      });
    });
  });
});
