import { Router } from "express";
import emptyEndpointResponse from "../utils/index.js";
const router = Router();
import { UserModel } from '../models/index.js'

// default route
router.get("/", (req, res) => {
  res.send(emptyEndpointResponse());
});

router.post("/users",  (req, res) => {
})

export default router;
