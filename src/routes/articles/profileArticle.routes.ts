import { Router } from 'express';
import ArticleController from '../../controllers/Article.controller';

const router: Router = Router({ mergeParams: true });

router.get('/:aSlug', ArticleController.show);

export default router;
