import ArticleModel from "../models/articles";
import TagModel from "../models/tags";
import { validateTagList } from "../utils/validators";
import UserModel from "../models/users";
import FollowModel from "../models/follows";
import FavoriteModel from "../models/favorties";
import sequelize from "../models";

export async function createArticle(userEmail, article) {
  const createSlug = titleToSlug(article.title);
  try {
    const newArticle = await ArticleModel.create({
      authorId: userEmail,
      title: article.title,
      slug: createSlug,
      description: article.description,
      body: article.body,
    });
    const { createdAt, updatedAt, authorId, id, slug, ...newArticlePayload } =
      newArticle.get();
    if (validateTagList(article.tagList)) {
      const dbTag = article.tagList.map((tag) => {
        return {
          articleId: newArticle.id,
          tag: tag,
        };
      });
      const tagListDb = await TagModel.bulkCreate(dbTag);
      newArticlePayload.tagList = tagListDb.map((tagList) => tagList.tag);
    }
    return newArticlePayload;
  } catch (e) {
    console.error(e);
    if (e.name === "SequelizeUniqueConstraintError") {
      throw new Error("Payload value(s) not unique");
    }
    return null;
  }
}
export async function queryOneArticle(slug) {
  try {
    const query = await ArticleModel.findOne({
      where: { slug: slug },
      attributes: [
        "id",
        "slug",
        "title",
        "description",
        "body",
        "updatedAt",
        "createdAt",
      ],
      include: [
        {
          model: TagModel,
          as: "tagList",
          attributes: ["tag"],
          required: false,
        },
        {
          model: UserModel,
          as: "favoritesCount",
          attributes: ["email"],
          required: false,
        },
        {
          model: UserModel,
          as: "author",
          attributes: ["username", "bio", "image"],
          required: false,
          include: [
            {
              model: UserModel,
              attributes: ["email"],
              as: "following",
              required: false,
              through: {
                attributes: [],
              },
            },
          ],
        },
      ],
    });
    const payload = query.get({ plain: true });
    payload.favoritesCount = payload.favoritesCount.length || 0;
    payload.favorited = false;
    payload.tagList = payload.tagList.map(({ tag }) => tag);
    payload.author.following = payload.author.following.length > 0;
    return payload;
  } catch (e) {
    console.error(e);
    return null;
  }
}
export function queryOneArticlePayloadFormat(article) {
  return {
    article: {
      slug: article.slug,
      title: article.title,
      description: article.description,
      body: article.body,
      tagList: article.tagList,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      favorited: article.favorited,
      favoritesCount: article.favoritesCount,
      author: {
        username: article.author.username,
        bio: article.author.bio,
        image: article.author.image,
        following: article.author.following,
      },
    },
  };
}
export async function favoriteArticle(userId, articleId) {
  try {
    await FavoriteModel.create({
      userId: userId,
      articleId: articleId,
    });
  } catch (e) {
    if (e.name === "SequelizeUniqueConstraintError") {
      throw new Error("Payload value(s) not unique");
    } else {
      throw e;
    }
  }
}
export async function unFavoriteArticle(userId, articleId) {
  try {
    const destroy = await FavoriteModel.destroy({
      where: {
        userId: userId,
        articleId: articleId,
      },
    });
    if (destroy === 0) {
      throw new Error("No rows destroyed");
    }
  } catch (e) {
    if (e.name === "SequelizeUniqueConstraintError") {
      throw new Error("Payload value(s) not unique");
    } else {
      throw e;
    }
  }
}
export function createArticlePayloadFormat(article) {
  return {
    article: {
      title: article.title,
      description: article.description,
      body: article.body,
      tagList: article.tagList,
    },
  };
}
export function titleToSlug(title) {
  const slug = title.toLowerCase().replace(/ /g, "-");
  return slug;
}
export async function queryOneArticleAndUpdate({ email, slug, payload }) {
  try {
    let query = await ArticleModel.findOne({
      where: { authorId: email, slug: slug },
      attributes: [
        "id",
        "slug",
        "title",
        "description",
        "body",
        "updatedAt",
        "createdAt",
      ],
      include: [
        {
          model: TagModel,
          as: "tagList",
          attributes: ["tag"],
          required: false,
        },
        {
          model: UserModel,
          as: "favoritesCount",
          attributes: ["email"],
          required: false,
        },
        {
          model: UserModel,
          as: "author",
          attributes: ["username", "bio", "image"],
          required: false,
          include: [
            {
              model: UserModel,
              attributes: ["email"],
              as: "following",
              required: false,
              through: {
                attributes: [],
              },
            },
          ],
        },
      ],
    });
    query.set(payload);
    await query.save();
    const article = query.get({ plain: true });
    article.favoritesCount = article.favoritesCount.length || 0;
    article.favorited = false;
    article.tagList = article.tagList.map(({ tag }) => tag);
    article.author.following = article.author.following.length > 0;
    return article;
  } catch (e) {
    console.error(e);
    if (e.name === "SequelizeUniqueConstraintError") {
      throw new Error("Payload value(s) not unique");
    }
    return null;
  }
}
