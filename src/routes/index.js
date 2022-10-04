import { Router } from "express";
import emptyEndpointResponse from "../utils/index.js";
const router = Router();
import { registerUser } from '../controllers/users'

// default route
router.get("/", (req, res) => {
  res.send(emptyEndpointResponse());
});

router.post("/users", registerUser)

export default router;
