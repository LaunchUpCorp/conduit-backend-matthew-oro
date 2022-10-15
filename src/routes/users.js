import { Router } from "express";
const router = Router();
import { registerUser, getUser, loginUser } from "../controllers/users";
import { deserializeUser } from "../middleware/deserializeUser";

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/", deserializeUser, getUser);

export default router;
