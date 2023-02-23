import { Router } from 'express';

import { authRequired } from '../middlewares/authRequired';
import userController from '../controllers/UserController';

const router = Router({ caseSensitive: true });

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'PATCH, DELETE');

  return next();
});

router.patch('/:id', authRequired, userController.update);
router.delete('/:id', authRequired, userController.delete);

export default router;
