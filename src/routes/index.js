import { Router } from 'express';

import healthRoute from './health';
import authRoutes from './auth';
import listRoutes from './list';
import userRoutes from './user';

const router = Router({ caseSensitive: true });

router.use('/api/v1/health', healthRoute);
router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/lists', listRoutes);
router.use('/api/v1/users', userRoutes);

export default router;
