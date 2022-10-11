import { Router } from "express";
const router = Router();
import { registerUser, getUser } from "../controllers/users";
import { deserializeUser } from "../middleware/deserializeUser";

router.post("/", registerUser);
router.get("/", deserializeUser, getUser);

export default router;
