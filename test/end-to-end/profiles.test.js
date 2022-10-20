import * as userControllerUtils from "../../src/utils/userControllerUtils";
import * as profileControllerUtils from "../../src/utils/profileControllerUtils";
import * as jwtUtils from "../../src/utils/jwtUtils";
import supertest from "supertest";
import createServer from "../../src/utils/serverSetup";
import { profileDbPayload, profileResponse } from "../utils/profilesTestValue";
import { verifyTokenPayload, dbPayload } from "../utils/testValues";
import { deserializeUser } from "../../src/middleware/deserializeUser";

const app = createServer();

describe("test profile routes", () => {
  // Following User Test
  
  describe("POST /api/profiles/:username/follow - Follow profile", () => {
    describe("Given the username to follow exists and current user is authenticated", () => {
      let token = "";
      beforeAll(() => (token = jwtUtils.signToken(dbPayload, "1m")));
      it("should return status 201 and profile payload", async () => {
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
          .mockReturnValueOnce(profileDbPayload);

        const followUserMock = jest
          .spyOn(profileControllerUtils, "followProfile")
          .mockReturnValueOnce(true);

        const { body, statusCode } = await supertest(app)
          .post("/api/profiles/tester/follow")
          .set("Authorization", `Bearer ${token}`);

        await deserializeUser(mockReq, mockRes, mockNext);

        expect(statusCode).toBe(201);

        expect(body).toEqual(profileResponse(true));

        // middleware tests
        expect(mockReq.get).toHaveBeenCalledWith(`Authorization`);
        expect(mockReq).toEqual({ ...mockReq, user: verifyTokenPayload });
        expect(mockNext).toHaveBeenCalled();
        //end of middleware tests

        expect(verifyTokenMock).toBeCalledWith(expect.any(String));

        expect(queryUserMock).toHaveBeenCalledWith({
          username: "tester",
        });

        expect(followUserMock).toHaveBeenCalledWith(
          verifyTokenPayload.email,
          profileDbPayload.email
        );
      });
    });
    describe("Given the username to follow does not exist and current user is authenticated", () => {
      let token = "";
      beforeAll(() => (token = jwtUtils.signToken(dbPayload, "1m")));
      it("should return status 404", async () => {
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
          .mockReturnValueOnce(null);

        const followUserMock = jest.spyOn(
          profileControllerUtils,
          "unfollowProfile"
        );

        const { statusCode } = await supertest(app)
          .post("/api/profiles/tester/follow")
          .set("Authorization", `Bearer ${token}`);

        expect(statusCode).toBe(404);

        await deserializeUser(mockReq, mockRes, mockNext);

        // middleware tests
        expect(mockReq.get).toHaveBeenCalledWith(`Authorization`);
        expect(mockReq).toEqual({ ...mockReq, user: verifyTokenPayload });
        expect(mockNext).toHaveBeenCalled();
        //end of middleware tests

        expect(verifyTokenMock).toBeCalledWith(expect.any(String));

        expect(queryUserMock).toHaveBeenCalledWith({
          username: expect.any(String),
        });

        expect(followUserMock).not.toHaveBeenCalled();
      });
    });
    describe("Given the username to follow is the same as current user and current user is authenticated", () => {
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

        const queryUserMock = jest
          .spyOn(userControllerUtils, "queryOneUser")
          .mockReturnValueOnce(null);

        const followUserMock = jest.spyOn(
          profileControllerUtils,
          "followProfile"
        );

        const { statusCode } = await supertest(app)
          .post("/api/profiles/newtwo/follow")
          .set("Authorization", `Bearer ${token}`);

        expect(statusCode).toBe(400);

        await deserializeUser(mockReq, mockRes, mockNext);

        // middleware tests
        expect(mockReq.get).toHaveBeenCalledWith(`Authorization`);
        expect(mockReq).toEqual({ ...mockReq, user: verifyTokenPayload });
        expect(mockNext).toHaveBeenCalled();
        //end of middleware tests

        expect(verifyTokenMock).toBeCalledWith(expect.any(String));

        expect(queryUserMock).not.toHaveBeenCalled();

        expect(followUserMock).not.toHaveBeenCalled();
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

        const queryUserMock = jest.spyOn(
          userControllerUtils,
          "queryOneUser"
        );

        const response = await supertest(app).post(
          "/api/profiles/tester/follow"
        );

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

        const queryUserMock = jest.spyOn(
          userControllerUtils,
          "queryOneUser"
        );

        const response = await supertest(app)
          .post("/api/profiles/tester/follow")
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
    describe("Given the username to follow is already followed and current user is authenticated", () => {
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

        const queryUserMock = jest
          .spyOn(userControllerUtils, "queryOneUser")
          .mockReturnValueOnce(profileDbPayload);

        const followUserMock = jest
          .spyOn(profileControllerUtils, "followProfile")
          .mockRejectedValueOnce(new Error("Payload value(s) not unique"));

        const { statusCode } = await supertest(app)
          .post("/api/profiles/tester/follow")
          .set("Authorization", `Bearer ${token}`);

        expect(statusCode).toBe(422);

        await deserializeUser(mockReq, mockRes, mockNext);

        // middleware tests
        expect(mockReq.get).toHaveBeenCalledWith(`Authorization`);
        expect(mockReq).toEqual({ ...mockReq, user: verifyTokenPayload });
        expect(mockNext).toHaveBeenCalled();
        //end of middleware tests

        expect(verifyTokenMock).toBeCalledWith(expect.any(String));

        expect(queryUserMock).toHaveBeenCalledWith({
          username: "tester",
        });

        expect(followUserMock).toHaveBeenCalled()
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
          "queryOneUser"
        );

        const response = await supertest(app)
          .post("/api/profiles/tester/follow")
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

  // Unfollowing User Test
  describe("DELETE /api/profiles/:username/follow - Unfollowing profile", () => {
    describe("Given the username to unfollow exists and current user is authenticated", () => {
      let token = "";
      beforeAll(() => (token = jwtUtils.signToken(dbPayload, "1m")));
      it("should return status 200 and profile payload", async () => {
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
          .mockReturnValueOnce(profileDbPayload);

        const unfollowUserMock = jest
          .spyOn(profileControllerUtils, "unfollowProfile")
          .mockReturnValueOnce(false);

        const { body, statusCode } = await supertest(app)
          .delete("/api/profiles/tester/follow")
          .set("Authorization", `Bearer ${token}`);

        await deserializeUser(mockReq, mockRes, mockNext);

        expect(statusCode).toBe(200);

        expect(body).toEqual(profileResponse(false));

        // middleware tests
        expect(mockReq.get).toHaveBeenCalledWith(`Authorization`);
        expect(mockReq).toEqual({ ...mockReq, user: verifyTokenPayload });
        expect(mockNext).toHaveBeenCalled();
        //end of middleware tests

        expect(verifyTokenMock).toBeCalledWith(expect.any(String));

        expect(queryUserMock).toHaveBeenCalledWith({
          username: "tester",
        });

        expect(unfollowUserMock).toHaveBeenCalledWith(
          verifyTokenPayload.email,
          profileDbPayload.email
        );
      });
    });

    describe("Given the username to unfollow does not exist and current user is authenticated", () => {
      let token = "";
      beforeAll(() => (token = jwtUtils.signToken(dbPayload, "1m")));
      it("should return status 404", async () => {
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
          .mockReturnValueOnce(null);

        const unfollowUserMock = jest.spyOn(
          profileControllerUtils,
          "unfollowProfile"
        );

        const { statusCode } = await supertest(app)
          .delete("/api/profiles/pokemon/follow")
          .set("Authorization", `Bearer ${token}`);

        expect(statusCode).toBe(404);

        await deserializeUser(mockReq, mockRes, mockNext);

        // middleware tests
        expect(mockReq.get).toHaveBeenCalledWith(`Authorization`);
        expect(mockReq).toEqual({ ...mockReq, user: verifyTokenPayload });
        expect(mockNext).toHaveBeenCalled();
        //end of middleware tests

        expect(verifyTokenMock).toBeCalledWith(expect.any(String));

        expect(queryUserMock).toHaveBeenCalledWith({
          username: "pokemon",
        });

        expect(unfollowUserMock).not.toHaveBeenCalled();
      });
    });
    describe("Given the username to unfollow is the same as current user and current user is authenticated", () => {
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

        const queryUserMock = jest
          .spyOn(userControllerUtils, "queryOneUser")
          .mockReturnValueOnce(null);

        const unfollowUserMock = jest.spyOn(
          profileControllerUtils,
          "unfollowProfile"
        );

        const { statusCode } = await supertest(app)
          .delete("/api/profiles/newtwo/follow")
          .set("Authorization", `Bearer ${token}`);

        expect(statusCode).toBe(400);

        await deserializeUser(mockReq, mockRes, mockNext);

        // middleware tests
        expect(mockReq.get).toHaveBeenCalledWith(`Authorization`);
        expect(mockReq).toEqual({ ...mockReq, user: verifyTokenPayload });
        expect(mockNext).toHaveBeenCalled();
        //end of middleware tests

        expect(verifyTokenMock).toBeCalledWith(expect.any(String));

        expect(queryUserMock).not.toHaveBeenCalled();

        expect(unfollowUserMock).not.toHaveBeenCalled();
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

        const queryUserMock = jest.spyOn(
          userControllerUtils,
          "queryOneUser"
        );

        const response = await supertest(app).delete(
          "/api/profiles/tester/follow"
        );

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

        const queryUserMock = jest.spyOn(
          userControllerUtils,
          "queryOneUser"
        );

        const response = await supertest(app)
          .delete("/api/profiles/tester/follow")
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

        const queryUserMock = jest.spyOn(
          userControllerUtils,
          "queryOneUser"
        );

        const response = await supertest(app)
          .delete("/api/profiles/tester/follow")
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
  // GET Profile Tests
  describe("GET /api/profiles/:username - Get profile data", () => {
    describe("Given the username to exist and current user is authenticated", () => {
      let token = "";
      beforeAll(() => (token = jwtUtils.signToken(dbPayload, "1m")));
      it("should return status 200 and profile payload", async () => {
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
          .mockReturnValueOnce(profileDbPayload);

        const isFollowingMock = jest
          .spyOn(profileControllerUtils, "isFollowing")
          .mockReturnValueOnce(false);

        const { body, statusCode } = await supertest(app)
          .get("/api/profiles/tester")
          .set("Authorization", `Bearer ${token}`);

        await deserializeUser(mockReq, mockRes, mockNext);

        expect(statusCode).toBe(200);

        expect(body).toEqual(profileResponse(false));

        // middleware tests
        expect(mockReq.get).toHaveBeenCalledWith(`Authorization`);
        expect(mockReq).toEqual({ ...mockReq, user: verifyTokenPayload });
        expect(mockNext).toHaveBeenCalled();
        //end of middleware tests

        expect(verifyTokenMock).toBeCalledWith(expect.any(String));

        expect(queryUserMock).toHaveBeenCalledWith({
          username: "tester",
        });

        expect(isFollowingMock).toHaveBeenCalledWith(
          verifyTokenPayload.email,
          profileDbPayload.email
        );
      });
    });

    describe("Given the username does not exist and current user is authenticated", () => {
      let token = "";
      beforeAll(() => (token = jwtUtils.signToken(dbPayload, "1m")));
      it("should return status 404", async () => {
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
          .mockReturnValueOnce(null);

        const isFollowingMock = jest.spyOn(
          profileControllerUtils,
          "isFollowing"
        );

        const { statusCode } = await supertest(app)
          .get("/api/profiles/pokemon")
          .set("Authorization", `Bearer ${token}`);

        expect(statusCode).toBe(404);

        await deserializeUser(mockReq, mockRes, mockNext);

        // middleware tests
        expect(mockReq.get).toHaveBeenCalledWith(`Authorization`);
        expect(mockReq).toEqual({ ...mockReq, user: verifyTokenPayload });
        expect(mockNext).toHaveBeenCalled();
        //end of middleware tests

        expect(verifyTokenMock).toBeCalledWith(expect.any(String));

        expect(queryUserMock).toHaveBeenCalledWith({
          username: "pokemon",
        });

        expect(isFollowingMock).not.toHaveBeenCalled();
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

        const queryUserMock = jest.spyOn(
          userControllerUtils,
          "queryOneUser"
        );

        const response = await supertest(app).get(
          "/api/profiles/tester"
        );

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

        const queryUserMock = jest.spyOn(
          userControllerUtils,
          "queryOneUser"
        );

        const response = await supertest(app)
          .get("/api/profiles/tester")
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

        const queryUserMock = jest.spyOn(
          userControllerUtils,
          "queryOneUser"
        );

        const response = await supertest(app)
          .get("/api/profiles/tester")
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
});
