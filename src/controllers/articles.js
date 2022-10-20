import { validateBody } from "../utils/validators";
import {
  createArticle,
  articlePayloadFormat,
} from "../utils/articleControllerUtils";
import { errorHandles } from "../utils/errorHandleUtils";

export async function handleCreateArticle(req, res) {
  try {
    const { article } = req.body;
    const expectedPayload = {
      title: "string",
      description: "string",
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

    const articlePayload = articlePayloadFormat(newArticle);

    return res.status(201).json(articlePayload);
  } catch (e) {
    console.error(e);

    const error = errorHandles.find(({ message }) => message === e.message);

    if (!error) return res.status(500).send("Server Error");

    return res.status(error.statusCode).send(error.message);
  }
}
