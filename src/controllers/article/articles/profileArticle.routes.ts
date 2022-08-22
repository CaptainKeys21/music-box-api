import { Router } from 'express';
import { index } from '../article.index';
import { show } from '../article.show';

const router: Router = Router({ mergeParams: true });

router.get('/', index);
router.get('/:aSlug', show);

export default router;
