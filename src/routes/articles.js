import { Router } from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { handleCreateArticle, handleQueryOneArticle, handleFavoriteArticle, handleUnFavoriteArticle, handleUpdateArticle, handleDeleteArticle } from "../controllers/articles";

const router = Router();

router.post("/", deserializeUser, handleCreateArticle);
router.get("/:slug", handleQueryOneArticle)
router.put("/:slug", deserializeUser, handleUpdateArticle)
router.delete("/:slug", deserializeUser, handleDeleteArticle)
router.post("/:slug/favorite", deserializeUser, handleFavoriteArticle)
router.delete("/:slug/favorite", deserializeUser, handleUnFavoriteArticle)

export default router;
