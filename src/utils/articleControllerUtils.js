import ArticleModel from "../models/articles";
import TagModel from "../models/tags";
import { validateTagList } from "../utils/validators";

export async function createArticle(userEmail, article) {
  try {
    const newArticle = await ArticleModel.create({
      authorId: userEmail,
      title: article.title,
      description: article.description,
      body: article.body,
    });
    const { createdAt, updatedAt, authorId, id, ...newArticlePayload } =
      newArticle.get();
    if (validateTagList(article.tagList)) {
      const dbTag = article.tagList.map((tag) => {
        return {
          articleId: newArticle.id,
          tag: tag,
        };
      });
      const tagListDb = await TagModel.bulkCreate(dbTag);
      newArticlePayload.tagList = tagListDb.map(tagList => tagList.tag)
    }
    return newArticlePayload;
  } catch (e) {
    console.error(e);
    if (e.name === "SequelizeUniqueContraintError") {
      throw new Error("Payload value(s) not unique");
    }
    return null;
  }
}
export function articlePayloadFormat(article) {
  return {
    article: {
      title: article.title,
      description: article.description,
      body: article.body,
      tagList: article.tagList,
    },
  };
}
