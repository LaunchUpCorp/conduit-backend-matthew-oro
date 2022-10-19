import { Router } from "express";
const router = Router();
import { deserializeUser } from "../middleware/deserializeUser";
import {
  handleFollowProfile,
  handleGetProfile,
  handleUnfollowProfile,
} from "../controllers/profiles";

router.post("/:username/follow", deserializeUser, handleFollowProfile);
router.delete("/:username/follow", deserializeUser, handleUnfollowProfile);
router.get("/:username", deserializeUser, handleGetProfile);

export default router;
