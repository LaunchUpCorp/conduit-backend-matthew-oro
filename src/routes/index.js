import { Router } from "express";
const router = Router();
import { registerUser, getUser } from '../controllers/users'

// default route
router.get("/", (req, res) => {
  res.status(200);
});

router.post("/users", registerUser)
router.get("/users", getUser)

export default router;

