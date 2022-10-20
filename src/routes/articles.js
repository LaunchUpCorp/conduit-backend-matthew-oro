import { Router } from "express";
import { deserializeUser } from "../middleware/deserializeUser";
import { handleCreateArticle } from "../controllers/articles";

const router = Router();

router.post("/", deserializeUser, handleCreateArticle);

export default router;
