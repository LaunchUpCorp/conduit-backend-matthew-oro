import {
  articleDbPayload,
  expectArticlePayload,
} from "../utils/articlesTestValue";
import { createArticle } from "../../src/utils/articleControllerUtils";
import { createUser } from "../../src/utils/userControllerUtils";
import UserModel from "../../src/models/users";

const user = {
  email: "person@person.person",
  username: "person",
  hash: "(Salt)y(Hash)browns",
};
describe("Integration tests for profile controller utils", () => {
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
        const { tagList, ...articleDbPayloadCase2 } = expectArticlePayload.article;
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
});
