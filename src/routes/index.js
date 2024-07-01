import { Router } from 'express';
import usersRouter from './users.js'
import productssRouter from './products.js'

const router = Router();
router.use(usersRouter);
router.use(productssRouter);

export default router;