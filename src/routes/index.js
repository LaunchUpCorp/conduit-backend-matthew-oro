import { Router } from "express";
import emptyEndpointResponse from "../utils/index.js";
const router = Router();

// default route
router.get("/", (req, res) => {
  res.send(emptyEndpointResponse());
});

export default router;
