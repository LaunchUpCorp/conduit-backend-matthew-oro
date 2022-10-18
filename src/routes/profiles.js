import { Router } from "express";
const router = Router();
import { deserializeUser } from "../middleware/deserializeUser";
import { handleFollowProfile, handleUnfollowProfile } from "../controllers/profiles"

router.post("/:username/follow", deserializeUser, handleFollowProfile);
router.delete("/:username/follow", deserializeUser, handleUnfollowProfile);

export default router;
