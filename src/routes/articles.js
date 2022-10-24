import { Router } from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { handleCreateArticle, handleQueryOneArticle } from "../controllers/articles";

const router = Router();

router.post("/", deserializeUser, handleCreateArticle);
router.get("/:slug",handleQueryOneArticle)

export default router;
