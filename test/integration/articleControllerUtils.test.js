import {
  articleDbPayload,
  expectArticlePayload,
  expectQueryArticlePayload,
} from "../utils/articlesTestValue";
import {
  createArticle,
  favoriteArticle,
  queryOneArticle,
} from "../../src/utils/articleControllerUtils";
import { createUser } from "../../src/utils/userControllerUtils";
import UserModel from "../../src/models/users";

const user = {
  email: "person@person.person",
  username: "person",
  hash: "(Salt)y(Hash)browns",
};
describe("Integration tests for article controller utils", () => {
  beforeAll(async () => {
    await createUser(user);
  });
  afterAll(async () => {
    await UserModel.destroy({
      where: {
        email: user.email,
      },
    });
  });
  describe("Test functionality of createArticle()", () => {
    describe("Given body payload with tag list is valid", () => {
      it("should return article db payload", async () => {
        const newArticle = await createArticle(user.email, articleDbPayload);
        expect(newArticle).toEqual(expectArticlePayload.article);
      });
    });
    describe("Given valid body payload without tagList", () => {
      it("should return article db payload", async () => {
        const { tagList, ...articleDbPayloadCase2 } = articleDbPayload;
        const newArticle = await createArticle(user.email, {
          ...articleDbPayloadCase2,
          title: "new article",
        });
        expect(newArticle).toEqual(expectArticlePayload.article);
      });
    });
    describe("Given valid body payload with invalid tagList", () => {
      it("should return article db payload", async () => {
        const { tagList, ...articleDbPayloadCase2 } =
          expectArticlePayload.article;
        const newArticle = await createArticle(user.email, {
          ...articleDbPayload,
          title: "newer article",
          tagList: [null, 13, [], {}],
        });
        expect(newArticle).toEqual(articleDbPayloadCase2);
      });
    });
    describe("Given body payload that is not unique ", () => {
      it("should return null", async () => {
        try {
          await createArticle(user.email, articleDbPayload);
        } catch (e) {
          expect(e.message).toEqual("Payload value(s) not unique");
        }
      });
    });
  });

  describe("Test functionality of queryOneArticlePayload()", () => {
    describe("Given slug query exists", () => {
      it("should return query one article db payload", async () => {
        const query = await queryOneArticle(articleDbPayload.slug);
        expect(query).toEqual({...expectQueryArticlePayload.article, id: expect.any(String)});
      });
    });
    describe("Given slug query does not exist ", () => {
      it("should return null", async () => {
        const query = await queryOneArticle("i-don't-exist");
        expect(query).toBeNull();
      });
    });
  });

  describe("Test functionality of favoriteArticle()", () => {
    let articleId = ""
    beforeAll(async () => articleId = await queryOneArticle(articleDbPayload.slug))
    describe("Given valid user and article id", () => {
      it("should add user id and article id to favorite table", async () => {
        await expect(await favoriteArticle(user.email,articleId.id)).toBe(undefined) // void function
      });
    });
    describe("Given user id or article id already in table  ", () => {
      it("should throw error", async () => {
        try{
          await favoriteArticle(user.email,articleId.id)
        }catch(e){
          expect(e.message).toEqual("Payload value(s) not unique") 
        }
      });
    });
  });
});
