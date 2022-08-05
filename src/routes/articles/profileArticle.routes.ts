import { Router } from 'express';
import ArticleController from '../../controllers/Article.controller';

const router: Router = Router({ mergeParams: true });

router.get('/', ArticleController.index);
router.get('/:aSlug', ArticleController.show);

export default router;
