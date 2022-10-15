import { Router } from "express";
const router = Router();
import userRoute from './users'

router.use('/users', userRoute)

export default router;

