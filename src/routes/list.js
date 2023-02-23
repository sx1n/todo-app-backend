import { Router } from 'express';

import listController from '../controllers/ListController';
import { authRequired } from '../middlewares/authRequired';
import { authHeader } from '../middlewares/authHeader';

const router = Router({ caseSensitive: true });

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

  return next();
});

router.get('/', authRequired, listController.index);
router.get('/search', authHeader, listController.search);
router.get('/:listId', authHeader, listController.show);
router.post('/', authRequired, listController.create);
router.put('/:listId', authRequired, listController.update);
router.delete('/:listId', authRequired, listController.delete);

export default router;
