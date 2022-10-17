import { Router } from "express";
const router = Router();
import { registerUser, getUser, loginUser, updateUser } from "../controllers/users";
import { deserializeUser } from "../middleware/deserializeUser";

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/", deserializeUser, getUser);
router.put("/", deserializeUser, updateUser)

export default router;
