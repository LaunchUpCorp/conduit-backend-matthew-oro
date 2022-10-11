import { Router } from "express";
const router = Router();
import userRoute from './users'

// default route
router.get("/", (req, res) => {
  res.status(200);
});

router.use('/users', userRoute)


export default router;

