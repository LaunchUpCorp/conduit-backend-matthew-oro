import { Router } from "express";
const router = Router();
import { registerUser } from '../controllers/users'

// default route
router.get("/", (req, res) => {
  res.status(200);
});

router.post("/users", registerUser)

export default router;

