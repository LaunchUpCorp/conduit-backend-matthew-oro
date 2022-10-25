import supertest from "supertest";
import createServer from "../../src/utils/serverSetup";
import {
  articleDbPayload,
  expectArticlePayload,
  articlePayload,
  invalidArticlePayloadFormat,
  invalidTaglistPayload,
  expectQueryArticlePayload,
  queryArticleDbPayload,
} from "../utils/articlesTestValue";
import { verifyTokenPayload, dbPayload } from "../utils/testValues";
import { deserializeUser } from "../../src/middleware/deserializeUser";
import * as jwtUtils from "../../src/utils/jwtUtils";
import * as articleControllerUtils from "../../src/utils/articleControllerUtils";

const app = createServer();

describe("test article route", () => {
  describe("POST /api/articles - Article creation", () => {
    describe("Given request payload is valid and current user is authenticated", () => {
      let token = "";
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
          .send(articlePayload);

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
      let token = "";
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
      let token = "";
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

        const createArticleMock = jest.spyOn(
          articleControllerUtils,
          "createArticle"
        );

        const { statusCode } = await supertest(app)
          .post("/api/articles")
          .set("Authorization", `Bearer ${token}`)
          .send(invalidArticlePayloadFormat);

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
      let token = "";
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
          .send(invalidTaglistPayload);

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
      let token = "";
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
          .send(articlePayload);

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
  //GET /api/articles/:slug

  describe("GET /api/articles/:slug - Get queried article", () => {
    describe("Given article query exists", () => {
      it("should return status 200 and queried article payload", async () => {
        const queryOneArticleMock = jest
          .spyOn(articleControllerUtils, "queryOneArticle")
          .mockReturnValueOnce(queryArticleDbPayload.article);

        const { body, statusCode } = await supertest(app).get(
          "/api/articles/slug-slug-slug"
        );

        expect(statusCode).toBe(200);

        expect(body).toEqual(expectQueryArticlePayload);
        // test for positive signed integer for favoritesCount
        //expect(body.article.author.favoritesCount).toBePosive()

        expect(queryOneArticleMock).toHaveBeenCalledWith(
          queryArticleDbPayload.article.slug
        );
      });
    });
    describe("Given article query does not exist", () => {
      it("should return status 404", async () => {
        const queryOneArticleMock = jest
          .spyOn(articleControllerUtils, "queryOneArticle")
          .mockReturnValueOnce(null);

        const { statusCode } = await supertest(app).get(
          "/api/articles/slug-slug-slug"
        );

        expect(statusCode).toBe(404);

        expect(queryOneArticleMock).toHaveBeenCalledWith(
          queryArticleDbPayload.article.slug
        );
      });
    });
  });

  // POST /api/articles/:slug/favorite
  describe("POST /api/articles/:slug/favorite - favorite article", () => {
    describe("Given query is valid and current user is authenticated", () => {
      let token = "";
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
        const modelInstanceMock = { ...queryArticleDbPayload.article, save: jest.fn(() => queryArticleDbPayload.article) }

        const queryOneArticleMock = jest
          .spyOn(articleControllerUtils, "queryOneArticle")
          .mockReturnValueOnce(modelInstanceMock);

        const favoriteArticleMock = jest.spyOn(
          articleControllerUtils,
          "favoriteArticle"
        ).mockReturnValueOnce(void 0)

        const { body, statusCode } = await supertest(app)
          .post("/api/articles/slug-slug-slug/favorite")
          .set("Authorization", `Bearer ${token}`);

        console.log(body)
        await deserializeUser(mockReq, mockRes, mockNext);

        expect(statusCode).toBe(201);

        expect(body).toEqual(expectQueryArticlePayload);

        // middleware tests
        expect(mockReq.get).toHaveBeenCalledWith(`Authorization`);
        expect(mockReq).toEqual({ ...mockReq, user: verifyTokenPayload });
        expect(mockNext).toHaveBeenCalled();
        //end of middleware tests

        expect(verifyTokenMock).toBeCalledWith(expect.any(String));

        expect(queryOneArticleMock).toHaveBeenCalledWith(
          queryArticleDbPayload.article.slug
        );
        expect(favoriteArticleMock).toHaveBeenCalledWith(
          "new@new.new",
          "ID of Article"
        );
        expect(modelInstanceMock.save).toHaveBeenCalled()
      });
    });
    describe("Given query does not exist and current user is authenticated", () => {
      let token = "";
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

        const queryOneArticleMock = jest
          .spyOn(articleControllerUtils, "queryOneArticle")
          .mockReturnValueOnce(null);
        const favoriteArticleMock = jest.spyOn(
          articleControllerUtils,
          "favoriteArticle"
        )

        const { statusCode } = await supertest(app)
          .post("/api/articles/slug-slug-slug/favorite")
          .set("Authorization", `Bearer ${token}`);

        await deserializeUser(mockReq, mockRes, mockNext);

        expect(statusCode).toBe(404);

        // middleware tests
        expect(mockReq.get).toHaveBeenCalledWith(`Authorization`);
        expect(mockReq).toEqual({ ...mockReq, user: verifyTokenPayload });
        expect(mockNext).toHaveBeenCalled();
        //end of middleware tests

        expect(verifyTokenMock).toBeCalledWith(expect.any(String));

        expect(queryOneArticleMock).toHaveBeenCalledWith(
          queryArticleDbPayload.article.slug
        );
        expect(favoriteArticleMock).not.toHaveBeenCalled();
      });
    });
    describe("Given query is already favorited and current user is authenticated", () => {
      let token = "";
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

        const queryOneArticleMock = jest
          .spyOn(articleControllerUtils, "queryOneArticle")
          .mockReturnValueOnce(queryArticleDbPayload.article);
        const favoriteArticleMock = jest
          .spyOn(articleControllerUtils, "favoriteArticle")
          .mockRejectedValueOnce(new Error("Payload value(s) not unique"));

        const { statusCode } = await supertest(app)
          .post("/api/articles/slug-slug-slug/favorite")
          .set("Authorization", `Bearer ${token}`)

        await deserializeUser(mockReq, mockRes, mockNext);

        expect(statusCode).toBe(422);

        // middleware tests
        expect(mockReq.get).toHaveBeenCalledWith(`Authorization`);
        expect(mockReq).toEqual({ ...mockReq, user: verifyTokenPayload });
        expect(mockNext).toHaveBeenCalled();
        //end of middleware tests

        expect(verifyTokenMock).toBeCalledWith(expect.any(String));

        expect(queryOneArticleMock).toHaveBeenCalledWith(
          queryArticleDbPayload.article.slug
        );
        expect(favoriteArticleMock).toHaveBeenCalledWith(
          verifyTokenPayload.email,
          "ARTICLE ID HERE"
        );
      });
    });
  });
});
