import supertest from "supertest";
import createServer from "../../src/utils/serverSetup"
import {
  articleDbPayload,
  expectArticlePayload,
  articlePayload,
  invalidArticlePayloadFormat,
  invalidTaglistPayload
} from "../utils/articlesTestValue";
import { verifyTokenPayload, dbPayload } from "../utils/testValues"
import { deserializeUser } from "../../src/middleware/deserializeUser";
import * as jwtUtils from "../../src/utils/jwtUtils"
import * as articleControllerUtils from "../../src/utils/articleControllerUtils"

const app = createServer();

describe("test article route", () => {
  describe("POST /api/articles - Article creation", () => {
    describe("Given request payload is valid and current user is authenticated", () => {
      let token = ""
      beforeAll(() => (token = jwtUtils.signToken(dbPayload, "1m")));
      it("should return status 201 and article payload", async () => {
        //middleware init
        const mockReq = {
          get: jest.fn(() => `Bearer ${token}`),
        };
        const mockRes = {};
        const mockNext = jest.fn();

        const verifyTokenMock = jest
          .spyOn(jwtUtils, "verifyToken")
          .mockReturnValueOnce(verifyTokenPayload);

        // end of middleware init

        const createArticleMock = jest
          .spyOn(articleControllerUtils, "createArticle")
          .mockReturnValueOnce(articleDbPayload);

        const { body, statusCode } = await supertest(app)
          .post("/api/articles")
          .set("Authorization", `Bearer ${token}`)
          .send(articlePayload)

        await deserializeUser(mockReq, mockRes, mockNext);

        expect(statusCode).toBe(201);

        expect(body).toEqual(expectArticlePayload);

        // middleware tests
        expect(mockReq.get).toHaveBeenCalledWith(`Authorization`);
        expect(mockReq).toEqual({ ...mockReq, user: verifyTokenPayload });
        expect(mockNext).toHaveBeenCalled();
        //end of middleware tests

        expect(verifyTokenMock).toBeCalledWith(expect.any(String));

        expect(createArticleMock).toHaveBeenCalledWith(
          verifyTokenPayload.email,
          articleDbPayload
        );
      });
    });
    describe("Given request payload is empty and current user is authenticated", () => {
      let token =""
      beforeAll(() => (token = jwtUtils.signToken(dbPayload, "1m")));
      it("should return status 400", async () => {
        //middleware init
        const mockReq = {
          get: jest.fn(() => `Bearer ${token}`),
        };
        const mockRes = {};
        const mockNext = jest.fn();

        const verifyTokenMock = jest
          .spyOn(jwtUtils, "verifyToken")
          .mockReturnValueOnce(verifyTokenPayload);

        // end of middleware init

        const createArticleMock = jest
          .spyOn(articleControllerUtils, "createArticle")
          .mockReturnValueOnce(articleDbPayload);

        const { statusCode } = await supertest(app)
          .post("/api/articles")
          .set("Authorization", `Bearer ${token}`);

        await deserializeUser(mockReq, mockRes, mockNext);

        expect(statusCode).toBe(400);

        // middleware tests
        expect(mockReq.get).toHaveBeenCalledWith(`Authorization`);
        expect(mockReq).toEqual({ ...mockReq, user: verifyTokenPayload });
        expect(mockNext).toHaveBeenCalled();
        //end of middleware tests

        expect(verifyTokenMock).toBeCalledWith(expect.any(String));

        expect(createArticleMock).not.toHaveBeenCalled();
      });
    });
    describe("Given invalid payload format", () => {
      let token =""
      beforeAll(() => (token = jwtUtils.signToken(dbPayload, "1m")));
      it("should return status 400", async () => {
        //middleware init
        const mockReq = {
          get: jest.fn(() => `Bearer ${token}`),
        };
        const mockRes = {};
        const mockNext = jest.fn();

        const verifyTokenMock = jest
          .spyOn(jwtUtils, "verifyToken")
          .mockReturnValueOnce(verifyTokenPayload);

        // end of middleware init

        const createArticleMock = jest
          .spyOn(articleControllerUtils, "createArticle")

        const { statusCode } = await supertest(app)
          .post("/api/articles")
          .set("Authorization", `Bearer ${token}`)
          .send(invalidArticlePayloadFormat)
          

        await deserializeUser(mockReq, mockRes, mockNext);

        expect(statusCode).toBe(400);

        // middleware tests
        expect(mockReq.get).toHaveBeenCalledWith(`Authorization`);
        expect(mockReq).toEqual({ ...mockReq, user: verifyTokenPayload });
        expect(mockNext).toHaveBeenCalled();
        //end of middleware tests

        expect(verifyTokenMock).toBeCalledWith(expect.any(String));

        expect(createArticleMock).not.toHaveBeenCalled();
      });
    });
    describe("Given valid payload, but tagList type is invalid", () => {
      let token = ""
      beforeAll(() => (token = jwtUtils.signToken(dbPayload, "1m")));
      it("should return status 400", async () => {
        //middleware init
        const mockReq = {
          get: jest.fn(() => `Bearer ${token}`),
        };
        const mockRes = {};
        const mockNext = jest.fn();

        const verifyTokenMock = jest
          .spyOn(jwtUtils, "verifyToken")
          .mockReturnValueOnce(verifyTokenPayload);

        // end of middleware init

        const createArticleMock = jest
          .spyOn(articleControllerUtils, "createArticle")
          .mockReturnValueOnce(articleDbPayload);

        const { statusCode } = await supertest(app)
          .post("/api/articles")
          .set("Authorization", `Bearer ${token}`)
          .send(invalidTaglistPayload)

        await deserializeUser(mockReq, mockRes, mockNext);

        expect(statusCode).toBe(400);

        // middleware tests
        expect(mockReq.get).toHaveBeenCalledWith(`Authorization`);
        expect(mockReq).toEqual({ ...mockReq, user: verifyTokenPayload });
        expect(mockNext).toHaveBeenCalled();
        //end of middleware tests

        expect(verifyTokenMock).toBeCalledWith(expect.any(String));

        expect(createArticleMock).not.toHaveBeenCalled();
      });
    });
    describe("Given request payload is not unique, and current user is authenticated", () => {
      let token = ""
      beforeAll(() => (token = jwtUtils.signToken(dbPayload, "1m")));
      it("should return status 422", async () => {
        //middleware init
        const mockReq = {
          get: jest.fn(() => `Bearer ${token}`),
        };
        const mockRes = {};
        const mockNext = jest.fn();

        const verifyTokenMock = jest
          .spyOn(jwtUtils, "verifyToken")
          .mockReturnValueOnce(verifyTokenPayload);

        // end of middleware init

        const createArticleMock = jest
          .spyOn(articleControllerUtils, "createArticle")
          .mockRejectedValueOnce(new Error("Payload value(s) not unique"));

        const { statusCode } = await supertest(app)
          .post("/api/articles")
          .set("Authorization", `Bearer ${token}`)
          .send(articlePayload)

        await deserializeUser(mockReq, mockRes, mockNext);

        expect(statusCode).toBe(422);

        // middleware tests
        expect(mockReq.get).toHaveBeenCalledWith(`Authorization`);
        expect(mockReq).toEqual({ ...mockReq, user: verifyTokenPayload });
        expect(mockNext).toHaveBeenCalled();
        //end of middleware tests

        expect(verifyTokenMock).toBeCalledWith(expect.any(String));

        expect(createArticleMock).toHaveBeenCalledWith(
          verifyTokenPayload.email,
          articleDbPayload
        );
      });
    });
  });
});
