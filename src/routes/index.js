import { Router } from "express";
const router = Router();
import userRoute from "./users";
import profileRoute from "./profiles";
import articleRoute from "./articles";

router.use("/users", userRoute);
router.use("/profiles", profileRoute);
router.use("/articles", articleRoute);

export default router;
