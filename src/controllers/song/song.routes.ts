import { Router } from 'express';
import loginRequired from '../../middlewares/loginRequired';
import { songDelete } from './song.delete';
import { index } from './song.index';
import { show } from './song.show';
import { store } from './song.store';

const router: Router = Router();

router.post('/', loginRequired, store);
router.get('/:slug', show);
router.delete('/:slug', loginRequired, songDelete);
router.get('/', index);

export default router;
