import { Router } from 'express';

import authController from '../controllers/AuthController';

const router = Router({ caseSensitive: true });

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'POST');

  return next();
});

router.post('/register', authController.register);
router.post('/authenticate', authController.auth);

export default router;
