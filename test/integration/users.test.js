import supertest from "supertest";
import createServer from "../../src/utils/serverSetup";
import * as userControllerUtils from "../../src/utils/userControllerUtils";
import * as bcryptUtils from "../../src/utils/bcryptUtils"
import {
  userPayload,
  createUserInput,
  invalidCreateUserInput,
  userLoginInput,
} from "../utils/testValues";

import sequelize from "../../src/models";

const app = createServer();

describe("test user routes", () => {
  describe("POST /api/users - user registration", () => {
    beforeAll(() => sequelize.drop());
    describe("Given request payload is empty", () => {
      it("should return status 201 and user payload", async () => {
        const createUserMock = await jest
          .spyOn(userControllerUtils, "createUser")
          .mockReturnValueOnce(userPayload);

        const { body, statusCode } = await supertest(app)
          .post("/api/users")
          .send(createUserInput);

        expect(statusCode).toBe(201);

        expect(body).toEqual(userPayload);

        expect(createUserMock).toHaveBeenCalledWith(createUserInput.user);
      });
    });
    describe("Request payload not given", () => {
      it("should return status 400", async () => {
        const { statusCode } = await supertest(app).post("/api/users");

        expect(statusCode).toBe(400);
      });
    });
    describe("Given request payload is invalid", () => {
      it("should return status 400", async () => {
        const { statusCode } = await supertest(app)
          .post("/api/users")
          .send(invalidCreateUserInput);

        expect(statusCode).toBe(400);
      });
    });
    describe("Given valid payload with invalid email format", () => {
      it("should return status 400", async () => {
        const invalidEmail = {
          user: { ...createUserInput.user, email: "faker" },
        };

        const { statusCode } = await supertest(app)
          .post("/api/users")
          .send(invalidEmail);

        expect(statusCode).toBe(400);
      });
    });
  });

  describe("POST /api/users/login - user login", () => {
    describe("given credentials is valid", () => {
      it("should return status 200 and user payload", async () => {
        const queryUserMock = jest.spyOn(userControllerUtils, "queryOneUser")
        .mockReturnValueOnce(userPayload);

        const verifyPasswordMock = jest.spyOn(bcryptUtils, "verifyPassword")
        .mockReturnValueOnce(true)

        const { body, statusCode } = supertest(app).post("/api/users/login")
        .send(userLoginInput)

        expect(statusCode).toBe(200)

        expect(queryUserMock).toHaveBeenCalledWith(userLoginInput.user.email)
        
        expect(verifyPasswordMock).toHaveBeenCalledWith(userLoginInput.user, userPayload)

        expect(body).toEqual(userPayload)

      });
    });
    describe.skip("given credentials is invalid", () => {
      it("should return status 403", async () => {});
    });
  });

  describe.skip("GET /api/users - get current user", () => {
    describe("given user authentication is valid", () => {
      it("should return status 200 and user payload", () => {});
    });
    describe("given user authentication is invalid", () => {
      it("should return 403 and redirect to '/'", async () => {});
    });
  });
});
// user routes
// test user registration
// valid params
// return values
// invalid params
// error values

// test user log in
// valid login
// retrun values
// invalid login
// error values

// test get-current user
// invalid auth
// error values
// valid auth
// return value
