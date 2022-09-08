import { Router } from "express";

const router = Router();

// default route
router.get("/", (req, res) => {
  res.send({ status: "API is running on /api" });
});

export default router;
