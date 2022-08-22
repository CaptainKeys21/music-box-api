import { Router } from 'express';
import loginRequired from '../../../middlewares/loginRequired';
import { index } from '../article.index';
import { store } from '../article.store';

const router: Router = Router();

router.get('/', index);
router.post('/', loginRequired, store);

export default router;
