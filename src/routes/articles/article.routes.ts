import { Router } from 'express';
import ArticleController from '../../controllers/Article.controller';
import loginRequired from '../../middlewares/loginRequired';

const router: Router = Router();

router.get('/', ArticleController.index);
router.post('/', loginRequired, ArticleController.store);

export default router;