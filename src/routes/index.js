import { Router } from "express";
const router = Router();
import userRoute from './users'
import profileRoute from './profiles'

router.use('/users', userRoute)
router.use('/profiles', profileRoute)

export default router;

