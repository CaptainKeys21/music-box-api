import { Router } from 'express';
import profileArticle from '../article/articles/profileArticle.routes';
import loginRequired from '../../middlewares/loginRequired';
import { index } from './profile.index';
import { show } from './profile.show';
import { update } from './profile.update';

const router: Router = Router();

router.get('/', index);
router.get('/:slug', show);
router.put('/', loginRequired, update);
//router.post('/', store);

router.use('/:pSlug/articles', profileArticle);

export default router;
