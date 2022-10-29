import { removeNull, validateBody } from "../utils/validators";
import {
  createArticle,
  queryOneArticle,
  createArticlePayloadFormat,
  queryOneArticlePayloadFormat,
  favoriteArticle,
  unFavoriteArticle,
  queryOneArticleAndUpdate,
  titleToSlug,
  destroyArticle
} from "../utils/articleControllerUtils";
import { errorHandles } from "../utils/errorHandleUtils";

export async function handleCreateArticle(req, res) {
  try {
    const { article } = req.body;
    const expectedPayload = {
      title: "string",
      description: "string",
      slug: "string",
      body: "string",
      tagList: "object null",
    };
    if (!article) {
      throw new Error("No payload found");
    }
    if (!validateBody(article, expectedPayload)) {
      throw new Error("Invalid payload format");
    }
    if (!!article.tagList && !Array.isArray(article.tagList)) {
      throw new Error("Invalid payload format"); // test this
    }

    const newArticle = await createArticle(req.user.email, article);

    const articlePayload = createArticlePayloadFormat(newArticle);

    return res.status(201).json(articlePayload);
  } catch (e) {
    console.error(e);

    const error = errorHandles.find(({ message }) => message === e.message);

    if (!error) return res.status(500).send("Server Error");

    return res.status(error.statusCode).send(error.message);
  }
}
export async function handleQueryOneArticle(req, res) {
  try {
    const query = await queryOneArticle(req.params.slug);

    if (!query) throw new Error("query does not exist");

    const payload = queryOneArticlePayloadFormat(query);

    return res.status(200).json(payload);
  } catch (e) {
    console.error(e);

    const error = errorHandles.find(({ message }) => message === e.message);

    if (!error) return res.status(500).send("Server Error");

    return res.status(error.statusCode).send(error.message);
  }
}
export async function handleFavoriteArticle(req, res) {
  try {
    const query = queryOneArticle(req.params.slug);
    if (!query) throw new Error("query does not exist");

    await favoriteArticle(req.user.email, query.id);
    await query.save();

    const payload = queryOneArticlePayloadFormat(query);

    return res.status(201).json(payload);
  } catch (e) {
    console.error(e);

    const error = errorHandles.find(({ message }) => message === e.message);

    if (!error) return res.status(500).send("Server Error");

    return res.status(error.statusCode).send(error.message);
  }
}
export async function handleUnFavoriteArticle(req, res) {
  try {
    const query = queryOneArticle(req.params.slug);
    if (!query) throw new Error("query does not exist");

    await unFavoriteArticle(req.user.email, query.id);
    await query.save();

    const payload = queryOneArticlePayloadFormat(query);

    return res.status(200).json(payload);
  } catch (e) {
    console.error(e);

    const error = errorHandles.find(({ message }) => message === e.message);

    if (!error) return res.status(500).send("Server Error");

    return res.status(error.statusCode).send(error.message);
  }
}
export async function handleUpdateArticle(req, res) {
  try {
    const { article } = req.body;
    if (!article) {
      throw new Error("No payload found");
    }
    const formatPayload = {
      slug: (article.title && titleToSlug(article.title)) || null,
      title: article.title || null,
      description: article.description || null,
      body: article.body || null,
    };
    const formattedArticle = removeNull(formatPayload);
    if (!formattedArticle) {
      throw new Error("Invalid payload format");
    }

    const updatedArticle = await queryOneArticleAndUpdate({
      email: req.user.email,
      slug: req.params.slug,
      payload: formattedArticle,
    });

    if (!updatedArticle) throw new Error("query does not exist");

    const payload = queryOneArticlePayloadFormat(updatedArticle);

    return res.status(200).json(payload);
  } catch (e) {
    console.error(e);

    const error = errorHandles.find(({ message }) => message === e.message);

    if (!error) return res.status(500).send("Server Error");

    return res.status(error.statusCode).send(error.message);
  }
}
export async function handleDeleteArticle(req, res) {
  try {

    await destroyArticle(req.user.email, req.params.slug)

    return res.sendStatus(200)

  } catch (e) {
    console.error(e);

    const error = errorHandles.find(({ message }) => message === e.message);

    if (!error) return res.status(500).send("Server Error");

    return res.status(error.statusCode).send(error.message);
  }
}
