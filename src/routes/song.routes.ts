import { Router } from 'express';
import SongController from '../controllers/Song.controller';
import loginRequired from '../middlewares/loginRequired';

const router: Router = Router();

router.post('/', loginRequired, SongController.store);
router.get('/:slug', SongController.show);
router.delete('/:slug', loginRequired, SongController.delete);
router.get('/', SongController.index);

export default router;
